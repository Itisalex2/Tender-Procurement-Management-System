const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Tenderer involved in the conversation
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: [] }],
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

// Middleware to auto-update lastUpdated when a message is added
conversationSchema.pre('save', function (next) {
  if (this.isModified('messages')) {
    this.lastUpdated = Date.now();
  }
  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
