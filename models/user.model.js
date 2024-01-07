const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    max: 50,
    default: '',
  },
  username: {
    type: String,
    unique: true,
    required: true,
    max: 25,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
