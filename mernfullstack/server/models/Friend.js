const mongoose = require('mongoose');
const FiendSchema = new mongoose.Schema(
	{
		Username: {
			type: String,
			required: 'require enter character'
		},
		Class: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);
const Friend = mongoose.model('Friend', FiendSchema);
module.exports = Friend;
