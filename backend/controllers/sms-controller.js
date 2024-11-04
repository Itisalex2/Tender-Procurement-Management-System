require('dotenv').config();
const Core = require('@alicloud/pop-core');
const VerificationCode = require('../models/verification-code-model');
const User = require('../models/user-model')
const jwt = require('jsonwebtoken');

// Helper function to create a token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// Initialize the client with the accessKeyId and secret
const client = new Core({
  accessKeyId: process.env.SMS_ACCESS_KEY_ID,
  accessKeySecret: process.env.SMS_ACCESS_KEY_SECRET,
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

async function sendSMSHelper(phoneNumber, signName, templateCode, templateParam) {
  const params = {
    RegionId: 'cn-hangzhou',
    PhoneNumbers: phoneNumber,
    SignName: signName,
    TemplateCode: templateCode,
    TemplateParam: JSON.stringify(templateParam)
  };

  const requestOption = {
    method: 'POST',
    timeout: 10000
  };

  try {
    const response = await client.request('SendRandomSMS', params, requestOption);
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

// Send randomn 6-digit code to the user's phone number
const sendRandomSMS = async (req, res) => {
  const { phoneNumber, signName, templateCode } = req.body;

  // Generate a random 6-digit code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiration time (5 minute from now)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Save the verification code in the database
  const codeEntry = new VerificationCode({ phoneNumber, code: verificationCode, expiresAt });
  await codeEntry.save();

  // Send the verification code via SMS
  try {
    const templateParam = { code: verificationCode };
    const response = await sendSMSHelper(phoneNumber, signName, templateCode, templateParam);
    res.status(200).json({ success: true, message: 'Verification code sent successfully!', data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending SMS', error: error.message });
  }
};

const verifyCode = async (req, res) => {
  const { phoneNumber, code } = req.body;
  verificationPhoneNumber = '86' + phoneNumber;

  try {
    const codeEntry = await VerificationCode.findOne({ phoneNumber: verificationPhoneNumber, code });


    if (!codeEntry) {
      return res.status(400).json({ success: false, message: '验证码错误' });
    }

    // Check if the code has expired
    if (codeEntry.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: '验证码失效' });
    }

    // Convert the phone number to a number/double to match MongoDB schema
    const phoneNumberAsDouble = parseFloat(phoneNumber);

    const user = await User.findOne({ number: phoneNumberAsDouble });

    if (!user) {
      return res.status(404).json({ success: false, message: '账户不存在' });
    }

    // Return user data for login
    const token = createToken(user._id);
    return res.status(200).json({ success: true, token });

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Verification failed', error: error.message });
  }
};

module.exports = { sendRandomSMS, verifyCode };

