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
    throw Error('所有字段必须填写');
  }

  // Email validation and existence check
  if (!validator.isEmail(email)) {
    throw Error('邮件地址不符合要求');
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('邮件地址已存在');
  }

  // Password strength check & hashing + salting
  if (!validator.isStrongPassword(password)) {
    throw Error('密码不符合要求');
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
    throw Error('所有字段必须填写');
  }

  // Check if the email exists and password matches
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('邮件地址/密码不正确');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('邮件地址/密码不正确');
  }

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
