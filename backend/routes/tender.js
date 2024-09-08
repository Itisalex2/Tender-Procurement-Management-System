const express = require('express');
const router = express.Router();
const { createTender } = require('../controllers/tender-controller');
const requireAuth = require('../middleware/require-auth');
const multer = require('multer');

// Set up multer for file uploads 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  }
});

const upload = multer({ storage });

router.use(requireAuth)

router.post('/create', upload.array('relatedFiles'), createTender);

module.exports = router;
