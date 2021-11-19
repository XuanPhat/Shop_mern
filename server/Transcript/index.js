var express = require('express');
var router = express.Router();
const PointModel = require('../models/Transcript');
router.get('/read', (req, res) => {
	PointModel.find({}, (err, result) => {
		res.send(result);
	});
});
router.post('/insert', async (req, res) => {
	const Idstudent = req.body.Idstudent;
	const Point = req.body.Point;
	const AddPoint = new PointModel({
		Idstudent,
		Point
	});
	await AddPoint.save()
		.then(() => res.json('Add Point successfully'))
		.catch(err => res.status(400).json('Error'));
});

module.exports = router;
