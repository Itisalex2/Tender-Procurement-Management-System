// routes/sms.js
const express = require('express');
const { sendSMS, verifyCode } = require('../controllers/sms-controller');

const router = express.Router();

router.post('/send', sendSMS);
router.post('/verify', verifyCode);

module.exports = router;
