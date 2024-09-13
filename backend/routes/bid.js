const express = require('express');
const router = express.Router();

// Middleware
const requireAuth = require('../middleware/require-auth');
const multer = require('multer');

// Controllers
const { getBidById, addBidEvaluation } = require('../controllers/bid-controller');


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

router.use(requireAuth); // Require authentication for the routes below

router.get('/:bidId', getBidById); // get a bid
router.post('/:bidId/evaluation', upload.array('files'), addBidEvaluation); // Add a new evaluation to a specific bid

module.exports = router;