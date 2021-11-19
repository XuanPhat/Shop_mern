const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require('cors');
const foodModel = require('./models/Food');
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const fileUpload = require('express-fileupload');
const CommentModel = require('./Product/models/comment');
app.use(
  fileUpload({
    useTempFiles: true
  })
);
const http = require('http').createServer(app);
const io = require('socket.io')(http);

mongoose.connect(process.env.DATABASE_MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
app.get('/read', (req, res) => {
  res.send('Chao mongo');
});

let users = [];
io.on('connection', socket => {
  socket.on('joinRoom', id => {
    const user = { userId: socket.id, room: id };
    const check = users.every(user => user.userId !== socket.id);
    if (check) {
      users.push(user);
      socket.join(user.room);
    } else {
      users.map(user => {
        if (user.userId === socket.id) {
          if (user.room !== id) {
            socket.leave(user.room);
            socket.join(id);
            user.room = id;
          }
        }
      });
    }

    // console.log('productId: ' + id);
  });
  socket.on('CreateComment', async socket => {
    const { user_id, Content, _id, valueRate } = socket;
    const Createcomment = new CommentModel({
      user_id: user_id,
      content: Content,
      rating: valueRate,
      product_id: _id
    });
    await Createcomment.save();

    io.to(Createcomment.product_id).emit('SendCommenttoClient', Createcomment);
  });
  socket.on('disconnect', () => {
    // console.log(socket.id + ' disconnected.')
    users = users.filter(user => user.userId !== socket.id);
  });
});

// app.post('/', (req, res) => {
// 	try {
// 		res.send('Xin chao123123123');
// 	} catch (error) {
// 		res.send('Error');
// 	}
// });

// app.post('/insert', async (req, res) => {
// 	const foodName = req.body.foodName;
// 	const daysSinceIAte = req.body.daysSinceIAte;
// 	const Food = new foodModel({
// 		foodName,
// 		daysSinceIAte
// 	});

// 	await Food.save()
// 		.then(() => res.json('Add foodname successfully'))
// 		.catch(err => res.status(400).json('Error'));
// 	res.send('Xin chao123');
// });
// app.get('/read', (req, res) => {
// 	try {
// 		foodModel.find({}, (err, result) => {
// 			res.send(result);
// 		});
// 	} catch (error) {
// 		console.log(error);
// 	}
// });
// app.post('/update/:id', async (req, res) => {
// 	const id = req.body.id;

// 	const foodName = req.body.foodName;

// 	try {
// 		foodModel.findById(id, (err, updatedfood) => {
// 			updatedfood.foodName = foodName;
// 			updatedfood
// 				.save()
// 				.then(() => res.json('Add foodname updated'))
// 				.catch(err => res.status(400).json('Error'));
// 		});
// 		// res.send(Newday);
// 	} catch (error) {
// 		console.log(error);
// 	}
// });

// app.delete('/delete/:id', async (req, res) => {
// 	const id = req.params.id;
// 	await foodModel.findByIdAndRemove(id).exec();
// 	res.send('Deleted');
// });
const Friend = require('./Friend/index');
const Point = require('./Transcript/index');

app.use('/friend', Friend);
app.use('/Point', Point);

const Blog = require('./Blog/controller/post');
// Blog MERN
app.use('/Blog', Blog);
// Product MERN
const product = require('./Product/controller/product');
const category = require('./Product/controller/category');
const Auth = require('./Product/controller/auth');
const Cart = require('./Product/controller/cart');
const Paypal = require('./Product/controller/paypal');
const Image = require('./Product/controller/Uploadimage/upload');
const Comment = require('./Product/controller/comment');
app.use('/product', product);
app.use('/category', category);
app.use('/cart', Cart);
// Authentication
app.use('/auth', Auth);
// Paypal
app.use('/paypal', Paypal);
// Upload images
app.use('/image', Image);

Comment;
app.use('/comment', Comment);

// listen server
http.listen(3001, () => {
  console.log('Server running on port 3001...');
});
