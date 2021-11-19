var express = require('express');
const { find, findOneAndUpdate } = require('../models/Friend');
var router = express.Router();
const FriendModel = require('../models/Friend');
router.get('/read', (req, res) => {
  FriendModel.find({}, (err, result) => {
    res.send(result);
  });
});
router.post('/insert', async (req, res) => {
  const Username = req.body.Username;
  const Class = req.body.Class;
  const Addfiend = new FriendModel({
    Username,
    Class
  });
  await Addfiend.save()
    .then(() => res.json('Add Friend successfully'))
    .catch(err => res.status(400).json('Error'));
});

router.put('/update/:id', async (req, res) => {
  const id = req.params.id;
  const Username = req.body.Username;
  await FriendModel.findById(id, (err, result) => {
    result.Username = Username;
    result
      .save()
      .then(() => res.json('Updated Friend'))
      .catch(err => res.status(400).json('Error'));
  });
});

module.exports = router;
