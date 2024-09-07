const express = require('express')
const requireAuth = require('../middleware/require-auth')

// controller functions

const { userSignup, userLogin } = require('../controllers/user-controller')

const router = express.Router()

router.post('/login', userLogin)   // login route
router.post('/signup', userSignup) // signup route

router.use(requireAuth)           // require auth for viewing profiles

module.exports = router