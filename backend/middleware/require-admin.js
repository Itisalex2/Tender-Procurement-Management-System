const User = require('../models/user-model');

const requireAdmin = async (req, res, next) => {
  const { user } = req; // Assuming the user is added to req by an authentication middleware

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const foundUser = await User.findById(user._id);

  if (!foundUser || foundUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied, admin only' });
  }

  next();
};

module.exports = { requireAdmin };
