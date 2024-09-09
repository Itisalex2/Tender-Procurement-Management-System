const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
  // verify user is authenticated

  const { authorization } = req.headers; // Authorization token from the headers
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1]; // Extract the token part from "Bearer <token>"

  try {
    const { _id } = jwt.verify(token, process.env.SECRET); // Extract _id from the token

    // Find the user by _id and select both _id and role
    req.user = await User.findOne({ _id }).select('_id role'); // Add both _id and role to req.user

    next(); // Proceed to the next middleware or route handler

  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;
