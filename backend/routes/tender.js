const express = require('express');
const router = express.Router();

// Controllers
const { createTender, getTenders, getTenderById, updateTenderById, deleteTenderById, changeTenderStatusToNegotiationCandidatesSelected } = require('../controllers/tender-controller');
const { submitBid, approveBidViewing, viewBids, selectNegotiationCandidateBid, removeNegotiationCandidateBid } = require('../controllers/bid-controller');
const { addMessageToConversation, getConversationMessages } = require('../controllers/chat-controller');

// Middleware
const requireAuth = require('../middleware/require-auth');
const upload = require('../utils/multer');

/* Routes */

router.use(requireAuth); // Require authentication for the routes below

// Files
router.post('/create', upload.array('relatedFiles'), createTender);
router.patch('/:id', upload.array('relatedFiles'), updateTenderById); // Update a tender by ID

// Tenders
router.delete('/:id', deleteTenderById); // Delete a tender by ID
router.get('', getTenders); // Get all tenders
router.get('/:id', getTenderById); // Get a tender by ID
router.patch('/:id/change-status-to-negotiation-candidates-selected', changeTenderStatusToNegotiationCandidatesSelected);

// Bids
router.post('/:id/bid', upload.array('files'), submitBid); // Submit a bid with file uploads
router.post('/:id/approveBidViewing', approveBidViewing); // Approve bid viewing
router.get('/:id/bids', viewBids); // View bids for a tender
router.patch('/:tenderId/bid/:bidId/select-negotiation-candidate-bid', selectNegotiationCandidateBid); // Select a NegotiationCandidate bid
// Add a new route to remove a negotiation candidate bid
router.patch('/:tenderId/bid/:bidId/remove-negotiation-candidate-bid', removeNegotiationCandidateBid); // Remove a NegotiationCandidate bid

// Chat
router.post('/:id/conversation', upload.array('files'), addMessageToConversation); // Post a message to a conversation
router.get('/:id/conversation', getConversationMessages); // Get all messages for a tender's conversation


module.exports = router;
