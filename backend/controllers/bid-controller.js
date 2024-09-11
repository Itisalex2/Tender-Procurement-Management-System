const Bid = require('../models/bid-model');

// Controller to submit a bid with file uploads
const submitBid = async (req, res) => {
  try {
    const { amount, content } = req.body;
    const tenderId = req.params.id;
    const userId = req.user._id;

    // Check if the tender exists
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    // Handle file uploads
    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files.map((file) => ({
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        uploadedBy: userId,
      }));
    }

    // Create a new bid
    const bid = new Bid({
      amount,
      content,
      tender: tenderId,
      bidder: userId,
      files: uploadedFiles,
    });

    // Save the bid
    await bid.save();

    // Add the bid to the tender's bid array
    tender.bids.push(bid._id);
    await tender.save();

    res.status(201).json({ message: 'Bid submitted successfully', bid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit bid' });
  }
};

module.exports = {
  submitBid
};