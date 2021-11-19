const mongoose = require('mongoose');
const PaypalSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  address: {
    type: Array,
    default: []
  },
  cart: {
    type: Array,
    default: []
  },
  paymentID: {
    type: String,
    required: true
  },
  totalPrice: {
    type: String,
    required: true
  }
});
const Paypal = mongoose.model('paypal', PaypalSchema);
module.exports = Paypal;
