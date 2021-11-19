var express = require('express');
const { findByIdAndRemove, findOneAndDelete } = require('../models/index');
var router = express.Router();
const Blogmodels = require('../models/index');
router.get('/read', (req, res) => {
  Blogmodels.find({}, (err, result) => {
    res.send(result);
  });
});
router.post('/insert', async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const likeCount = req.body.likeCount;
  const Addblog = Blogmodels({
    title,
    content
  });
  await Addblog.save()
    .then(() => res.json(Addblog))
    .catch(err => res.status(400).json('Error'));
});
router.post('/update', async (req, res) => {
  try {
    const UpdateBlog = req.body;
    const update = await Blogmodels.findOneAndUpdate(
      { _id: UpdateBlog._id },
      UpdateBlog,
      { new: true }
    );
    res.status(200).json(update);
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    const Update = await Blogmodels.findByIdAndUpdate(
      req.params.id,
      {
        $set: { title: req.body.title, content: req.body.content }
      },
      { new: true }
    );
    res.status(200).json(Update);
  } catch (error) {
    res.status(400).json({ err: error });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteblog = await Blogmodels.findByIdAndDelete(id);

    res.status(200).json(deleteblog);
  } catch (error) {
    res.status(400).json({ err: error });
  }
});
// router.post('/update/:_id', (req, res) => {
// 	const id = req.params._id;

// 	const likeCount = req.body.likeCount;
// 	const title = req.body.title;
// 	const content = req.body.content;
// 	// const likeCount = req.body.likeCount;
// 	Blogmodels.findById(id, (err, result) => {
// 		result.likeCount = likeCount;
// 		result.title = title;
// 		result.content = content;
// 		result
// 			.save()
// 			.then(() => res.json('Updated'))
// 			.catch(err => res.status(400).json('Error'));
// 	});
// });
module.exports = router;
