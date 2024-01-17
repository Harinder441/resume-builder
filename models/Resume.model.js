 
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  personalInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalInfoDB' },
  education: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EducationDB' }],
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SkillsDB' }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectsDB' }],
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExperiencesDB' }],
  honorsAwards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HonorsAwardDB' }],
  // Add other fields for the resume
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
