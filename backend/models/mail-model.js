const mongoose = require('mongoose');
const User = require('./user-model');

const mailSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['tender', 'message', 'notification', 'bid'], required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  relatedItem: { type: mongoose.Schema.Types.ObjectId, refPath: 'type' }, // Refers to a tender, message, etc.
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

mailSchema.statics.sendMail = async function (sender, recipient, type, subject, content, relatedItem) {
  const mail = await this.create({ sender, recipient, type, subject, content, relatedItem });
  recipientInfo = await User.findById(recipient);
  recipientInfo.inbox.push(mail._id);
  await recipientInfo.save();
  return mail;
}

const Mail = mongoose.model('Mail', mailSchema);
module.exports = Mail;
