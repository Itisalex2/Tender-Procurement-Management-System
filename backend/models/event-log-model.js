const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    enum: ['login', 'logout', 'download'],
    required: true
  },
  fileName: {
    type: String,  // Only needed for download events
    required: function () {
      return this.eventType === 'download';
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// Static methods to log events
eventLogSchema.statics.recordLogin = async function (userId) {
  return await this.create({
    userId: userId,
    eventType: 'login',
  });
};

eventLogSchema.statics.recordLogout = async function (userId) {
  return await this.create({
    userId: userId,
    eventType: 'logout',
  });
};

eventLogSchema.statics.recordDownload = async function (userId, fileName) {
  return await this.create({
    userId: userId,
    eventType: 'download',
    fileName: fileName,
  });
};

const EventLog = mongoose.model('EventLog', eventLogSchema);

module.exports = EventLog;
