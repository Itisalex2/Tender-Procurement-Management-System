const Bid = require('../models/bid-model');
const Tender = require('../models/tender-model');

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

const approveBidViewing = async (req, res) => {
  try {
    const { id } = req.params; // Tender ID
    const userId = req.user._id; // User making the request

    // Use findOneAndUpdate to atomically add the user to procurementGroupApprovals
    const tender = await Tender.findOneAndUpdate(
      { _id: id },
      { $addToSet: { procurementGroupApprovals: userId } }, // Add the user to approvals if not already there
      { new: true }
    ).populate('procurementGroup');

    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    // Check if all procurement group members have approved
    const allApproved = tender.procurementGroup.every(user =>
      tender.procurementGroupApprovals.includes(user._id.toString())
    );

    if (allApproved) {
      tender.status = 'ClosedAndCanSeeBids';
      await tender.save();
    }

    res.status(200).json(tender);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve bid viewing.' });
  }
};

const viewBids = async (req, res) => {
  try {
    const tenderId = req.params.id;

    // Find the tender by its ID and populate both bids and the bidder field inside each bid
    const tender = await Tender.findById(tenderId).populate({
      path: 'bids',
      populate: {
        path: 'bidder',
        select: 'username'
      }
    });

    if (!tender) {
      return res.status(404).json({ message: '招标未找到。' });
    }

    // Check if the tender's status allows viewing bids
    if (tender.status !== 'ClosedAndCanSeeBids') {
      return res.status(403).json({ message: '您无权查看此招标的投标。' });
    }

    // Return the populated bids if the status is correct
    res.status(200).json(tender.bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: '服务器错误，无法获取投标。' });
  }
};


module.exports = {
  submitBid,
  approveBidViewing,
  viewBids
};
