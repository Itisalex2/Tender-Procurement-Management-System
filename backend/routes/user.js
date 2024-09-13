const express = require('express')
const requireAuth = require('../middleware/require-auth')

// controller functions

const { userSignup, userLogin, userSettings, getUserInfo, getAllUsers, getUserById, updateUserById } = require('../controllers/user-controller')

const router = express.Router()

router.post('/login', userLogin)   // login route
router.post('/signup', userSignup) // signup route

router.use(requireAuth) // require authentication for the routes below
router.patch('/settings', userSettings) // settings route
router.patch('/:id', updateUserById)  // Update a user by ID
router.get('/getAll', getAllUsers) // Get a list of all users
router.get('/me', getUserInfo) // user info
router.get('/:id', getUserById); // Fetch user by ID

module.exports = router