 
const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, },
  startDate: { type: Date, },
  endDate: { type: Date, },
  institution: { type: String, },
  location: { type: String, },
  score: { type: Number, },
  scoreType: { type: String, },
  title:{ type: String, },
  notionPageId:{ type: String,}
});

const EducationDB = mongoose.model('EducationDB', educationSchema);

module.exports = EducationDB;
