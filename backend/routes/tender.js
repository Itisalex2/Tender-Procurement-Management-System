const express = require('express');
const router = express.Router();

// Controllers
const { createTender, getTenders, getTenderById, updateTenderById, deleteTenderById } = require('../controllers/tender-controller');
const { submitBid, approveBidViewing, viewBids } = require('../controllers/bid-controller');
const { addMessageToConversation, getConversationMessages } = require('../controllers/chat-controller');

// Middleware
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

/* Routes */

router.use(requireAuth); // Require authentication for the routes below

// Files
router.post('/create', upload.array('relatedFiles'), createTender);
router.patch('/:id', upload.array('relatedFiles'), updateTenderById); // Update a tender by ID

// Tenders
router.delete('/:id', deleteTenderById); // Delete a tender by ID
router.get('', getTenders); // Get all tenders
router.get('/:id', getTenderById); // Get a tender by ID

// Bids
router.post('/:id/bid', upload.array('files'), submitBid); // Submit a bid with file uploads
router.post('/:id/approveBidViewing', approveBidViewing); // Approve bid viewing
router.get('/:id/bids', viewBids); // View bids for a tender

// Chat
router.post('/:id/conversation', addMessageToConversation); // Post a message to a conversation
router.get('/:id/conversation', getConversationMessages); // Get all messages for a tender's conversation


module.exports = router;
