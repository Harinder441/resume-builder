 
const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  institution: { type: String, required: true },
  location: { type: String, required: true },
  score: { type: Number, required: true },
  scoreType: { type: String, required: true },
  title:{ type: String, required: true },
  notionPageId:{ type: String, required: true }
});

const EducationDB = mongoose.model('EducationDB', educationSchema);

module.exports = EducationDB;
