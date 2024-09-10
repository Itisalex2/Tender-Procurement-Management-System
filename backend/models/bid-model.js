const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  submittedAt: { type: Date, default: Date.now },
  content: { type: String }, // Additional details about the bid
  files: [{
    fileName: { type: String },
    fileUrl: { type: String },
    dateUploaded: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }]
});

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
