const express = require('express')
const requireAuth = require('../middleware/require-auth')

// controller functions

const { userSignup, userLogin, userSettings, getUserInfo, getAllUsers } = require('../controllers/user-controller')

const router = express.Router()

router.post('/login', userLogin)   // login route
router.post('/signup', userSignup) // signup route

router.use(requireAuth) // require authentication for the routes below
router.patch('/settings', userSettings) // settings route
router.get('/getAll', getAllUsers) // Get a list of all users
router.get('', getUserInfo) // user info


module.exports = router