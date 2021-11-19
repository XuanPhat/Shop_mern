const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema(
  {
    namecategory: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const Category = mongoose.model('category', CategorySchema);
module.exports = Category;
