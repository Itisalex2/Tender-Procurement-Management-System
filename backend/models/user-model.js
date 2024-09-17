const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Schema = mongoose.Schema;
const roles = require('../../frontend/src/utils/roles')

const userSchema = new Schema({
  username: { type: String, required: true }, // If tenderer, this means buisness name
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: Number, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: roles,
    default: 'tenderer'
  },
  inbox: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mail', default: [] }],
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid', default: [] }], // Only relevant if role is tenderer
  tendererDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TendererDetails',
    default: null
  }
}, {
  timestamps: true,
});

// static signup method
userSchema.statics.signup = async function (username, email, password, number, role = 'tenderer') {
  // validation
  if (!username || !email || !password || !number || !role) {
    throw Error('allFieldsRequired');
  }

  // Email validation and existence check
  if (!validator.isEmail(email)) {
    throw Error('incorrectEmailFormat');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('emailAlreadyExists');
  }

  // Password strength check & hashing + salting
  if (!validator.isStrongPassword(password)) {
    throw Error('passwordNotStrongEnough');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create user object with the provided role
  const user = await this.create({ username, email, password: hash, number, role });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('allFieldsRequired');
  }

  // Check if the email exists and password matches
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('emailPasswordIncorrect');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('emailPasswordIncorrect');
  }

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
