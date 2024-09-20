const mongoose = require('mongoose');

// Tender version history
const versionSchema = new mongoose.Schema({
  tenderSnapshot: { type: Object, required: true }, // A snapshot of the tender state
  changeReason: { type: String, required: true }, // Explanation of why the change was made
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who made the change
  changedAt: { type: Date, default: Date.now }, // When the change was made
});

const tenderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  issueDate: { type: Date, required: true },
  closingDate: { type: Date, required: true },
  contactInfo: {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: Number, required: true },
  },
  otherRequirements: { type: String, default: '' }, // Additional requirements for the tender
  relatedFiles: [{
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    dateUploaded: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }],
  status: { type: String, enum: ['Open', 'Closed', 'ClosedAndCanSeeBids', 'NegotiationCandidatesSelected', 'Failed'], default: 'Open' },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
  targetedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Users that are able to see the tender
  conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', default: [] }], // Conversations related to the tender
  procurementGroupApprovals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Track who has approved
  procurementGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Array of users in the procurement group
  negotiationCandidatesBids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid', default: [] }], //  Bids that are candidates for negotiation

  // Versions array to track past states of the tender
  versions: [versionSchema],
});

// Middleware to handle creating an initial version snapshot when tender is created or updated
tenderSchema.pre('save', async function (next, options) {
  const isCreating = this.isNew;
  const isModified = this.isModified();

  const currentTenderState = this.toObject();
  delete currentTenderState.versions; // Don't include the versions array in the snapshot

  // Get _userId and _changeReason from options
  const userId = options._userId;
  const changeReason = options._changeReason;

  // On creation, save the initial version
  if (isCreating && userId && changeReason) {
    this.versions.push({
      tenderSnapshot: currentTenderState,
      changeReason: changeReason,
      changedBy: userId,
    });
  }

  // On modification, save the current version before changes
  if (!isCreating && isModified && changeReason && userId) {
    this.versions.push({
      tenderSnapshot: currentTenderState,
      changeReason: changeReason,
      changedBy: userId,
    });
  }

  next();
});

const Tender = mongoose.model('Tender', tenderSchema);

module.exports = Tender;
