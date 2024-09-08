const express = require('express')
const requireAuth = require('../middleware/require-auth')
const { requireAdmin } = require('../middleware/require-admin');

// controller functions

const { getAllUsers } = require('../controllers/admin-controller')

const router = express.Router()

router.use(requireAuth)
router.use(requireAdmin);

router.get('/users', getAllUsers)

module.exports = router