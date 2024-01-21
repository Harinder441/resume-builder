 
const mongoose = require('mongoose');
const resumeItemSchema = new mongoose.Schema({
  id:{type:mongoose.Schema.Types.ObjectId},
  rank:{type:Number},
  hideFields:{type:Object},
})
const resumeSchema = new mongoose.Schema({
  personalInfo: { type: resumeItemSchema, ref: 'PersonalInfoDB' },
  links: [{ type: resumeItemSchema, ref: 'SocialLinksDB' }],
  education: [{ type: resumeItemSchema, ref: 'EducationDB' }],
  skills: [{ type: resumeItemSchema, ref: 'SkillsDB' }],
  projects: [{ type: resumeItemSchema, ref: 'ProjectsDB' }],
  experiences: [{ type: resumeItemSchema, ref: 'ExperiencesDB' }],
  honorsAwards: [{ type: resumeItemSchema, ref: 'HonorsAwardDB' }],
  title:{type:String},
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
