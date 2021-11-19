const express = require('express');
const router = express.Router();
const Cartmodel = require('../models/cart');
const Middleware = require('../middleware/Authorization');

router.get('/read', Middleware, async (req, res) => {
  try {
    const Cart = await Cartmodel.find({
      userId: req.userId
    });
    res.json(Cart);
  } catch (error) {
    res.status(400).json('Error Cart');
  }
});
router.post('/addtocart', Middleware, async (req, res) => {
  const { name, price, image, _id, quantity } = req.body;
  // const item = req.body;
  const Updatecart = req.body;
  try {
    const Existed = await Cartmodel.findOne({
      idProduct: _id,
      userId: req.userId,
      name
    });
    if (Existed) {
      const Cartproductexisted = await Cartmodel.findOneAndUpdate(
        { name, userId: req.userId, quantity: { $lte: 19 } },
        { $inc: { quantity: 1 }, idProduct: _id, image, price },
        { upsert: false }
      );
      if (Cartproductexisted) {
        return res.status(200).json(Cartproductexisted);
      }
    } else {
      const Addcart = new Cartmodel({
        idProduct: _id,
        name,
        price,
        image,
        userId: req.userId
      });
      await Addcart.save()
        .then(() => {
          res.status(200).json(Addcart);
        })
        .catch(err => {
          res.status(400).json({ success: true, message: 'add failed' });
        });
    }

    // const Cartproductexisted = await Cartmodel.findOneAndUpdate(
    //   {
    //     name: Updatecart.name,
    //     userId: req.userId,
    //     quantity: { $lte: 19 }
    //   },
    //   {
    //     $inc: { quantity: 1 },

    //     image: Updatecart.image,
    //     price: Updatecart.price
    //   },
    //   {
    //     new: true,
    //     upsert: true
    //   }
    // );
    // if (Cartproductexisted) {
    //   res.status(200).json(Cartproductexisted);
    // } else {
    //   res.status(200).json({ message: 'Quantity is less than 20' });
    // }
  } catch (error) {
    res.status(400).json({ success: false, message: 'add cart failed' });
  }
});
router.post('/Increasecart', Middleware, async (req, res) => {
  const Updatecart = req.body;
  try {
    const Cartproductexisted = await Cartmodel.findOneAndUpdate(
      { _id: Updatecart._id, userId: req.userId, quantity: { $lte: 19 } },
      { $inc: { quantity: 1 } },
      {
        new: true
      }
    );
    if (Cartproductexisted) {
      res.status(200).json(Cartproductexisted);
    } else {
      res.status(200).json({ message: 'Quantity is less than 20' });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post('/decreasecart', Middleware, async (req, res) => {
  const Updatecart = req.body;

  try {
    const Cartproductexisted = await Cartmodel.findOneAndUpdate(
      {
        _id: Updatecart._id,
        userId: req.userId,
        quantity: { $gte: 2 }
      },
      { $inc: { quantity: -1 } },
      {
        new: true
      }
    );
    if (Cartproductexisted) {
      res.status(200).json(Cartproductexisted);
    } else {
      res.status(200).json({ message: 'Quantity is greater than 1' });
    }
  } catch (error) {
    console.log(error);
  }
});
router.delete('/Deletecart/:id', async (req, res) => {
  await Cartmodel.findByIdAndDelete(req.params.id)
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: 'Delete cart successfully' });
    })
    .catch(err => {
      res.status(400).json({ success: false, message: 'Delete cart Failed' });
    });
});

module.exports = router;
