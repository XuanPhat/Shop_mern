const Authmodel = require('../models/auth');
const Admin = async (req, res, next) => {
  try {
    const User = await Authmodel.findOne({ _id: req.userId });
    if (User.role === 0)
      return res.status(400).json({ message: 'Admin resources access denied' });

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = Admin;
