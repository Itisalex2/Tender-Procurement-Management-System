const User = require('../models/user-model');
const roles = require('../../frontend/src/utils/roles')
const bcrypt = require('bcrypt');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  const { sort } = req.query;
  try {
    const sortOption = sort ? { username: 1 } : {};
    const users = await User.find().select('-password').sort(sortOption);

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { email, password, number, role } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update email if provided
    if (email) {
      user.email = email;
    }

    // Update password if provided (hash it first)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Update number if provided
    if (number) {
      user.number = number;
    }

    // Update role if provided
    if (role) {
      const validRoles = roles;
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      user.role = role;
    }

    // Save the updated user
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};


const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Add a new user (admin only)
const createUser = async (req, res) => {
  const { username, email, password, number, role } = req.body;

  try {
    // Use the signup method defined in the User model to create the user
    const newUser = await User.signup(username, email, password, number, role);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser, getUserById, createUser };
