var express = require('express');
var router = express.Router();
const CategoryModel = require('../models/category');
const category = [
  {
    namecategory: 'iphone'
  },
  {
    namecategory: 'apple'
  }
];
router.get('/read', (req, res) => {
  CategoryModel.find({}, (err, result) => {
    res.send(result);
  });
});
router.post('/insert', (req, res) => {
  CategoryModel.insertMany(category)
    .then(() => {
      res.status(200).send('add many successfully');
    })
    .catch(() => {
      res.status(400).send('Error');
    });
});

module.exports = router;
