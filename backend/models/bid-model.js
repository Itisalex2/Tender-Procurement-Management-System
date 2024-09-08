const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  submittedAt: { type: Date, default: Date.now },
  content: { type: String } // Field for additional context or details about the bid
});

const Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;
