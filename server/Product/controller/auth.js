const express = require('express');
const router = express.Router();
const Authmodel = require('../models/auth');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const middelware = require('../middleware/Authorization');
router.get('/read', (req, res) => {
  Authmodel.find({}, (err, result) => {
    res.send(result);
  });
});
// Kiem tra xem nguoi dung đã login hay chưa
router.get('/checkuser', middelware, async (req, res) => {
  const Checkuser = await Authmodel.findById(req.userId);
  try {
    if (!Checkuser) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    }
    return res
      .status(200)
      .json({ success: true, message: 'User checked', Checkuser });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Token not found' });
  }
});
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .json({ success: false, message: 'Match enter username and password' });
  }
  try {
    const UserExists = await Authmodel.findOne({ username });
    if (UserExists)
      return res.status(400).json({ success: false, message: 'User existed' });

    const passwordHash = await argon2.hash(password);
    const Registerauth = new Authmodel({
      username,
      password: passwordHash
    });
    await Registerauth.save();
    const Accesstoken = jwt.sign(
      { userId: Registerauth._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({ success: true, message: 'Register successfully', Accesstoken });
    //   .status(200)
    //   .json({ success: true, match: 'Register username successfully' });
    // if (Registerauth) {
    //   res
    //     .status(200)
    //     .json({ success: true, match: 'Register username successfully' });
    // }
  } catch (error) {
    console.log(error);
  }
});

router.post('/login', async (req, res) => {
  const { username, password, rememberme } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'missing enter username and password' });
  }

  try {
    const User = await Authmodel.findOne({ username });
    if (!User)
      return res
        .status(400)
        .json({ success: false, message: 'username or password incorrect' });

    const verifyPassword = await argon2.verify(User.password, password);
    if (!verifyPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'username or password incorrect' });
    }
    const Tokenpassword = await jwt.sign(
      { username: username, password: password },
      process.env.ENCODE_PASSWORD,
      {
        expiresIn: '1m'
      }
    );
    // const refreshTokenPassword = await jwt.sign(
    //   { username: username, password: password },
    //   process.env.REFRESH_TOKEN,
    //   {
    //     expiresIn: '7d'
    //   }
    // );
    // await Authmodel.findOneAndUpdate(
    //   { username },
    //   {
    //     password_digest: rememberme ? refreshTokenPassword : null
    //   }
    // );

    const Accesstoken = await jwt.sign(
      { userId: User._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: 'Login successfully',
      Accesstoken,
      Tokenpassword
    });
  } catch (error) {
    console.log(error);
  }
});

// router.post('/refreshtoken', (req, res) => {
//   const { refreshTokenPassword } = req.body;
//   try {
//     jwt.verify(
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRydW9uZyBTb24iLCJwYXNzd29yZCI6IjEyMzEyMyIsImlhdCI6MTYyODUzMTg1MiwiZXhwIjoxNjI5MTM2NjUyfQ.LMSMxFxxgGLo3KomrlhINtOojSiNTKhTQYroC9jhX8A',
//       process.env.REFRESH_TOKEN,
//       (err, user) => {
//         if (err) return res.status(400).json({ msg: err.message });
//         const Tokenpassword = jwt.sign(
//           { username: user.username, password: user.password },
//           process.env.ENCODE_PASSWORD,
//           {
//             expiresIn: '1m'
//           }
//         );
//         res.json({ Tokenpassword });
//       }
//     );
//   } catch (error) {
//     return res.status(500).json({ msg: error.message });
//   }
// });

router.patch('/addcart', middelware, async (req, res) => {
  try {
    const Checkuser = await Authmodel.findById(req.userId).select('-password');
    if (!Checkuser) {
      return res.status(400).json({ message: 'User not found!' });
    }
    await Authmodel.findOneAndUpdate(
      { _id: req.userId },
      {
        cart: req.body.cart
      }
    );
    return res.status(200).json({ message: 'Added to cart' });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
router.get('/getcart', middelware, async (req, res) => {
  try {
    await Authmodel.find({ _id: req.userId }, (err, result) => {
      res.send(result);
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
