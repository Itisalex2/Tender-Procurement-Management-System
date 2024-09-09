const express = require('express');
const router = express.Router();
const { createTender, getTenders, getTenderById, updateTenderById, deleteTenderById } = require('../controllers/tender-controller');
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

// Routes

router.use(requireAuth); // Require authentication for the routes below
router.post('/create', upload.array('relatedFiles'), createTender);
router.patch('/:id', upload.array('relatedFiles'), updateTenderById); // Update a tender by ID
router.delete('/:id', deleteTenderById); // Delete a tender by ID
router.get('', getTenders); // Get all tenders
router.get('/:id', getTenderById); // Get a tender by ID

module.exports = router;
