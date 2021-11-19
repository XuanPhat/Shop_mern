const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema(
  {
    Product: {
      type: [],
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth'
    }
  },
  {
    timestamps: true
  }
);
const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
