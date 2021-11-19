const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      text: true,
      unique: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    namecategory: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    numReviews: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
