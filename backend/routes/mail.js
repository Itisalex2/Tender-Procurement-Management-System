const express = require('express')
const requireAuth = require('../middleware/require-auth')

const { updateMailById, getUserMails, markAllMailsAsRead } = require('../controllers/mail-controller')

// controller functions

const router = express.Router()

router.use(requireAuth) // require authentication for the routes below

router.patch('/markAllRead', markAllMailsAsRead) // Mark all mails as read for logged in users
router.patch('/:id', updateMailById); // Update a mail by ID
router.get('/getAllMails', getUserMails); // Get the mails for the logged in user

module.exports = router