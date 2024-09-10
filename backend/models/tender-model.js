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
  }],
  status: { type: String, enum: ['Open', 'Closed', 'Awarded'], default: 'Open' },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
  targetedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
});

const Tender = mongoose.model('Tender', tenderSchema);

module.exports = Tender;
