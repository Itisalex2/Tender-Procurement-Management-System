// routes/sms.js
const express = require('express');
const { sendRandomSMS, verifyCode } = require('../controllers/sms-controller');

const router = express.Router();

router.post('/send', sendRandomSMS);
router.post('/verify', verifyCode);

module.exports = router;
