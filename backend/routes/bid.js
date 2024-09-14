const express = require('express');
const router = express.Router();

// Middleware
const requireAuth = require('../middleware/require-auth');
const upload = require('../utils/multer');

// Controllers
const { getBidById, addBidEvaluation } = require('../controllers/bid-controller');


router.use(requireAuth); // Require authentication for the routes below

router.get('/:bidId', getBidById); // get a bid
router.post('/:bidId/evaluation', upload.array('files'), addBidEvaluation); // Add a new evaluation to a specific bid

module.exports = router;