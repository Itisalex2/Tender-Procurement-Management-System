const express = require('express')
const requireAuth = require('../middleware/require-auth')
const upload = require('../utils/multer');

// controller functions

const { userSignup, userLogin, userSettings, getUserInfo, getAllUsers, getUserById, updateUserById, updateTendererDetails, getTenderers } = require('../controllers/user-controller')

const router = express.Router()

router.post('/login', userLogin)   // login route
router.post('/signup', userSignup) // signup route

router.use(requireAuth) // require authentication for the routes below

router.patch('/settings', userSettings) // settings route
router.patch('/tenderer-details', upload.array('relatedFiles', 2), updateTendererDetails) // settings route
router.patch('/:id', updateUserById)  // Update a user by ID
router.get('/getTenderers', getTenderers) // Get a list of tenderers
router.get('/getAll', getAllUsers) // Get a list of all users
router.get('/me', getUserInfo) // user info
router.get('/:id', getUserById); // Fetch user by ID

module.exports = router