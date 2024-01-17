 
const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  startDate: { type: Date, required: true },
  completionDate: { type: Date, required: true },
  institution: { type: String, required: true },
  // Add other fields for education
});

const EducationDB = mongoose.model('EducationDB', educationSchema);

module.exports = EducationDB;
