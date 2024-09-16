const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  issueDate: { type: Date, required: true },
  closingDate: { type: Date, required: true },
  contactInfo: {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, required: true },
  },
  otherRequirements: { type: String, default: '' }, // Additional requirements for the tender
  relatedFiles: [{
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    dateUploaded: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }],
  status: { type: String, enum: ['Open', 'Closed', 'ClosedAndCanSeeBids', 'Awarded'], default: 'Open' },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
  targetedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Users that are able to see the tender
  conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', default: [] }], // Conversations related to the tender
  procurementGroupApprovals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Track who has approved
  procurementGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Array of users in the procurement group
  winningBid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }, // Winning bid
});

const Tender = mongoose.model('Tender', tenderSchema);

module.exports = Tender;
