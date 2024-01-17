 
const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // Add other fields for personal information
});

const PersonalInfoDB = mongoose.model('PersonalInfoDB', personalInfoSchema);

module.exports = PersonalInfoDB;
