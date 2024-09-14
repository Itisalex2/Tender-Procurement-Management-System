const Bid = require('../models/bid-model');
const Tender = require('../models/tender-model');
const Mail = require('../models/mail-model');
const convertToUTF8 = require("../utils/file-conversion");

// Controller to submit a bid with file uploads
const submitBid = async (req, res) => {
  try {
    const { amount, content } = req.body;
    const tenderId = req.params.id;
    const userId = req.user._id;

    // Check if the tender exists
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ error: '招标不存在' });
    }

    // Handle file uploads
    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files.map((file) => ({
        fileName: convertToUTF8(file.originalname),
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

    res.status(201).json(bid);
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
      return res.status(404).json({ error: '招标不存在' });
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

    // Find the tender by its ID and fully populate the bids with bidder and evaluations
    const tender = await Tender.findById(tenderId).populate({
      path: 'bids',
      populate: [
        { path: 'bidder', select: 'username' }, // Populate bidder's username
        {
          path: 'evaluations.evaluator',
          select: 'username', // Populate evaluator's username in evaluations
        },
        {
          path: 'files.uploadedBy',
          select: 'username', // Populate file uploader's username
        },
      ]
    });

    if (!tender) {
      return res.status(404).json({ message: '招标未找到。' });
    }

    // Check if the tender's status allows viewing bids
    if (tender.status !== 'ClosedAndCanSeeBids' && tender.status !== 'Awarded') {
      return res.status(403).json({ message: '您无权查看此招标的投标。' });
    }

    // Return the fully populated tender object
    res.status(200).json(tender.bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: '服务器错误，无法获取投标。' });
  }
};


// Controller to get the details of a particular bid
const getBidById = async (req, res) => {
  try {
    const { bidId } = req.params;

    // Find the bid by ID and populate bidder and evaluations.evaluator fields
    const bid = await Bid.findById(bidId).populate([
      { path: 'bidder', select: 'username' }, // Populate bidder's username
      { path: 'evaluations.evaluator', select: 'username' } // Populate evaluator's username
    ]);

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    res.status(200).json(bid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve bid details' });
  }
};


// Controller to add a new evaluation to a specific bid
const addBidEvaluation = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const bidId = req.params.bidId;
    const evaluatorId = req.user._id;

    // Find the bid by ID
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Handle file uploads for evaluation
    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files.map((file) => ({
        fileName: convertToUTF8(file.originalname),
        fileUrl: `/uploads/${file.filename}`,
        uploadedBy: evaluatorId,
      }));
    }

    // Create the new evaluation
    const newEvaluation = {
      evaluator: evaluatorId,
      score,
      feedback,
      relatedFiles: uploadedFiles,
      evaluatedAt: new Date(),
    };

    // Add the evaluation to the bid
    bid.evaluations.push(newEvaluation);
    await bid.save();

    // Populate the evaluator field in the newly added evaluation
    const populatedBid = await Bid.findById(bid._id).populate({
      path: 'evaluations.evaluator',
      select: 'username',
    });

    // Get the newly added evaluation with the populated evaluator
    const populatedEvaluation = populatedBid.evaluations[populatedBid.evaluations.length - 1];

    res.status(201).json({ message: 'Evaluation added successfully', evaluation: populatedEvaluation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add evaluation' });
  }
};

const selectWinningBid = async (req, res) => {
  const { tenderId, bidId } = req.params;
  const userId = req.user._id;

  try {
    // Find the tender and populate its bids
    const tender = await Tender.findById(tenderId).populate('bids');



    if (!tender) {
      return res.status(404).json({ error: '招标不存在' });
    }

    // Set the status of the winning bid to 'won'
    const winningBid = await Bid.findById(bidId).populate('bidder');
    if (!winningBid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    winningBid.status = 'won';
    await winningBid.save();

    // Set all other bids in the tender to 'lost'
    for (let bid of tender.bids) {
      if (bid._id.toString() !== bidId) {
        bid.status = 'lost';
        await bid.save();
      }
    }

    // Create and save mail to the winner
    const mail = new Mail({
      sender: userId,
      recipient: winningBid.bidder._id,
      type: 'bid',
      subject: `您${tender.title}的投标已被选中`,
      content: `恭喜！您的投标已被选中。请查看招标详情以获取更多信息。`,
      relatedItem: winningBid._id,
    });

    const savedMail = await mail.save();

    // Push the saved mail to the winner's inbox
    winningBid.bidder.inbox.push(savedMail._id);
    await winningBid.bidder.save();

    // Update the tender's winning bid
    tender.winningBid = bidId;
    tender.status = 'Awarded';
    await tender.save();

    res.status(200).json(bidId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update bids' });
  }
};



module.exports = {
  submitBid,
  approveBidViewing,
  viewBids,
  getBidById,
  addBidEvaluation,
  selectWinningBid
};
