const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['tender', 'message', 'notification'], required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  relatedItem: { type: mongoose.Schema.Types.ObjectId, refPath: 'type' }, // Refers to a tender, message, etc.
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const Mail = mongoose.model('Mail', mailSchema);
module.exports = Mail;
