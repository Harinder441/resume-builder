 
const mongoose = require('mongoose');

const experiencesSchema = new mongoose.Schema({
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  company: { type: String, required: true },
  // Add other fields for experiences
});

const ExperiencesDB = mongoose.model('ExperiencesDB', experiencesSchema);

module.exports = ExperiencesDB;
