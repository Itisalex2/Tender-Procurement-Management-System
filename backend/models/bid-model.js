const mongoose = require('mongoose');

const bidEvaluationSchema = new mongoose.Schema({
  evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the evaluator (procurement team member)
  score: { type: Number, required: true }, // Score or rating for the bid
  feedback: { type: String }, // Optional feedback or comments
  evaluatedAt: { type: Date, default: Date.now }, // Time of evaluation
  relatedFiles: [{
    fileName: { type: String },
    fileUrl: { type: String },
    dateUploaded: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }] // Files uploaded as part of the evaluation
});

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
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  evaluations: { type: [bidEvaluationSchema], default: [] },
  status: { type: String, enum: ['Pending', 'Won', 'Lost'], default: 'Pending' }
});

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
