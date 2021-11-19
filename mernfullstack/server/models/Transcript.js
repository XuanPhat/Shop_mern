const mongoose = require('mongoose');
const PointSchema = new mongoose.Schema({
	Idstudent: {
		type: String,
		required: 'require enter character'
	},
	Point: {
		type: Number,
		required: true
	}
});
const Point = mongoose.model('Point', PointSchema);
module.exports = Point;
