var express = require('express');
var router = express.Router();
var CommentModel = require('../models/comment');
router.get('/read', async (req, res) => {
  await CommentModel.find({}, (err, result) => {
    if (err) return res.status(400).json({ err: err });
    res.send(result);
  });
});

// get comment product id

router.get('/read/:product_id', async (req, res) => {
  try {
    const page = 1;
    const limit = JSON.parse(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const Commentdetail = await CommentModel.find({
      product_id: req.params.product_id
    })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    if (Commentdetail) {
      res.status(200).json(Commentdetail);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/insert', (req, res) => {});
module.exports = router;
