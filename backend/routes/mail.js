const express = require('express')
const requireAuth = require('../middleware/require-auth')

const { updateMailById, getUserMails, markMailsAsRead, deleteMails, sendToSuppliers } = require('../controllers/mail-controller')

// controller functions

const router = express.Router()

router.use(requireAuth) // require authentication for the routes below

router.patch('/markAsRead', markMailsAsRead); // Mark selected mails as read
router.patch('/:id', updateMailById); // Update a mail by ID
router.get('/getAllMails', getUserMails); // Get the mails for the logged in user
router.delete('/deleteMails', deleteMails); // Route for deleting mails
router.post('/sendToSuppliers', sendToSuppliers); // Route for sending mail to tender suppliers

module.exports = router