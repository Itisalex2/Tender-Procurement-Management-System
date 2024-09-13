const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  issueDate: { type: Date, required: true },
  closingDate: { type: Date, required: true },
  contactInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  otherRequirements: { type: String }, // Additional requirements for the tender
  relatedFiles: [{
    fileName: { type: String },
    fileUrl: { type: String },
    dateUploaded: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
