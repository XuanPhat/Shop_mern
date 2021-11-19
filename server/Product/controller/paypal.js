var express = require('express');
var router = express.Router();
const PaypalModel = require('../models/paypal');
const AuthModel = require('../models/auth');
const middleware = require('../middleware/Authorization');
router.get('/read', (req, res) => {
  try {
    PaypalModel.find({}, (err, result) => {
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});
router.post('/insert', middleware, async (req, res) => {
  try {
    const { paymentID, address, cart, totalPrice } = req.body;
    const User = await AuthModel.findById(req.userId);
    if (!User) {
      res.status(400).json({ success: false, message: 'User not found' });
    }
    const Paypalinsert = new PaypalModel({
      paymentID,
      address,
      cart,
      username: User.username,
      totalPrice
    });
    await Paypalinsert.save();
    res.status(200).json({ success: true, message: 'Payment successfull' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Payment error' });
  }
});

module.exports = router;
