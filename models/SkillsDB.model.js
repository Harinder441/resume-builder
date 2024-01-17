 
const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
  skillType: { type: String, required: true },
  skillValue: { type: String, required: true },
  // Add other fields for skills
});

const SkillsDB = mongoose.model('SkillsDB', skillsSchema);

module.exports = SkillsDB;
