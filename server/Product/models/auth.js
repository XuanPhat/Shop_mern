const mongoose = require('mongoose');
const AuthSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    cart: {
      type: Array,
      default: []
    },
    role: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);
const Authentication = mongoose.model('Auth', AuthSchema);
module.exports = Authentication;
