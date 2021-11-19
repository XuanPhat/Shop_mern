const mongoose = require('mongoose');
const FoodSchema = new mongoose.Schema({
	foodName: {
		type: String,
		required: 'require enter character'
	},
	daysSinceIAte: {
		type: Number,
		required: true
	}
},{
 timestamps : true
});
const Food = mongoose.model('Food', FoodSchema);
module.exports = Food;
