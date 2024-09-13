const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Mail = require('../models/mail-model');

// Helper function to create a token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// User login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    const token = createToken(user._id); // create token
    res.status(200).json({
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User signup
const userSignup = async (req, res) => {
  const { username, email, password, number } = req.body;
  try {
    const user = await User.signup(username, email, password, number);
    const token = createToken(user._id);
    res.status(200).json({
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user settings
const userSettings = async (req, res) => {
  const userId = req.user._id;
  const updates = req.body;

  try {
    // Only allow specific fields to be updated
    const allowedUpdates = ['username', 'email', 'number', 'password'];
    const requestedUpdates = Object.keys(updates);
    const isValidOperation = requestedUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    // If updating the password, hash it before saving
    if (updates.password) {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Find user and update the fields
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back only the fields that were updated
    const response = {};
    requestedUpdates.forEach(update => {
      response[update] = updatedUser[update];
    });

    res.status(200).json(response); // Respond with updated fields
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch user info
const getUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // Get the 'role' query parameter from the request

    // Create a query object. If 'role' is provided, use it to filter users by role.
    const query = role ? { role: { $in: role.split(',') } } : {}; // Allow multiple roles by splitting with ','

    // Find users that match the query, and exclude the password from the results.
    const users = await User.find(query).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Fetch any user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the route parameter
    const user = await User.findById(id).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



const updateUserById = async (req, res) => {
  const userId = req.params.id;
  const { username, email, password, number, role, newMail } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if provided
    if (username) {
      user.username = username;
    }

    if (email) {
      // Check if the new email is valid
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      // Check if email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: 'Email is already in use' });
      }

      user.email = email;
    }

    if (password) {
      // Check if the new password is strong
      if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ error: 'Password does not meet strength requirements' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user.password = hash;
    }

    if (number) {
      user.number = number;
    }

    if (role) {
      // Ensure the role is one of the allowed values
      if (!['admin', 'tenderer', 'tenderProcurementGroup', 'gjcWorker'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      user.role = role;
    }

    // Add new mail to inbox if provided
    if (newMail) {
      // Create a new Mail document
      const mail = new Mail(newMail);
      await mail.save();

      // Add the new mail's ObjectId to the user's inbox
      user.inbox.push(mail._id);
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { userSignup, userLogin, userSettings, getUserInfo, getAllUsers, getUserById, updateUserById };
