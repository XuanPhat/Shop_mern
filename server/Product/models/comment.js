const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      ref: 'Auth'
    },
    content: {
      type: String
    },
    rating: {
      type: Number,
      default: 0
    },
    product_id: {
      type: String,
      ref: 'Product'
    },
    reply: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);
const Comment = mongoose.model('comment', CommentSchema);
module.exports = Comment;
