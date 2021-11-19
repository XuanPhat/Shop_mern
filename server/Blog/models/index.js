const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    Statuslike: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
