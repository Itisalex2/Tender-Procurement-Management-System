const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  timestamp: { type: Date, default: Date.now },
  relatedFiles: [{
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    dateUploaded: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }],
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
