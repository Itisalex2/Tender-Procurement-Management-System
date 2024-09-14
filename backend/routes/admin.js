const express = require('express')
const requireAuth = require('../middleware/require-auth')
const { requireAdmin } = require('../middleware/require-admin');

// controller functions

const { getAllUsers, getUserById, updateUserRole, deleteUser, createUser } = require('../controllers/admin-controller')

const router = express.Router()

router.use(requireAuth)

router.post('/users', createUser); // Add a new user

router.use(requireAdmin);
router.get('/users', getAllUsers) // Get a list of all users
router.get('/users/:userId', getUserById); // Get a specific user's info
router.patch('/users/:userId/role', updateUserRole); // Update a user's role
router.delete('/users/:userId', deleteUser); // Delete a user


module.exports = router