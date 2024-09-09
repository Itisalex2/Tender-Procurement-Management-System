const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema;
const { ObjectID } = require('mongoose').Types

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email must be unique
  password: { type: String, required: true },
  number: { type: Number, required: true },
}, {
  timestamps: true,
});

// static signup method
userSchema.statics.signup = async function (username, email, password, number) {
  // validation
  if (!username || !email || !password || !number) {
    throw Error('All fields must be filled')
  }

  //email validation and existence
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  //password strength check & hashing+salting
  //Password requirements: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough')
  }

  const salt = await bcrypt.genSalt(10) // the higher this number, the harder the password is to crack
  const hash = await bcrypt.hash(password, salt)

  //create user object
  const user = await this.create({ username, email, password: hash, number })

  return user
}

//static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  //run email & pswd matches
  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}
const User = mongoose.model('User', userSchema);

module.exports = User;
