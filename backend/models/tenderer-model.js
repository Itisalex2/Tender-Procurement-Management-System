const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TendererDetails Schema
const tendererDetailsSchema = new Schema({
  businessLicense: { type: String, required: true }, // URL of business license image
  businessType: { type: String, required: true },
  legalRepresentative: { type: String, required: true },
  dateOfEstablishment: { type: Date, required: true },
  country: { type: String, required: true },
  officeAddress: { type: String, required: true },
  legalRepresentativeBusinessCard: { type: String, required: true }, // URL of business card image
  unifiedSocialCreditCode: { type: String, required: true },

  // For management use
  verified: { type: Boolean, default: false },
  // Internal comments
  comments: [{
    commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
});

const TendererDetails = mongoose.model('TendererDetails', tendererDetailsSchema);

module.exports = TendererDetails;