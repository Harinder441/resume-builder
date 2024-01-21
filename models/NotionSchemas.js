const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  skills: [{ id: { type: String } }],
  liveUrl: { type: String },
  repoUrl: { type: String },
  postUrl: { type: String },
  status: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  type: { type: String },
  days: { type: Number },
  title: { type: String },
  notionPageId: { type: String }
});

const educationSchema = new mongoose.Schema({
  degree: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  institution: { type: String },
  location: { type: String },
  score: { type: Number },
  scoreType: { type: String },
  title: { type: String },
  notionPageId: { type: String }
});

const experiencesSchema = new mongoose.Schema({
  jobTitle: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  company: { type: String },
  location: { type: String },
  employer: { type: String },
  description: { type: String },
  title: { type: String },
  notionPageId: { type: String }
});

const honorsAwardSchema = new mongoose.Schema({
  summary: { type: String },
  title: { type: String },
  notionPageId: { type: String }
});

const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  mobile: { type: String },
  address: { type: String },
  headline: { type: String },
  title: { type: String },
  notionPageId: { type: String }
});
const skillsSchema = new mongoose.Schema({
  dateAcq: { type: Date },
  certifications: [{ id: { type: String } }],
  subtype: { type: String },
  projects: [{ id: { type: String } }],
  type: { type: String },
  level: { type: String },
  name: { type: String },
  title: { type: String },
  notionPageId: { type: String }
});

const socialLinksSchema = new mongoose.Schema({
  displayName: { type: String },
  type: { type: String },
  url: { type: String },
  title: { type: String },
  notionPageId: { type: String }
});

module.exports = {
  projectsSchema,
  educationSchema,
  experiencesSchema,
  honorsAwardSchema,
  personalInfoSchema,
  skillsSchema,
  socialLinksSchema
}