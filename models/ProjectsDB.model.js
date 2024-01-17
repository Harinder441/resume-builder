 
const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
  name: { type: String, },
  description: { type: String, },
  skills:[{id:{type:String}}],
  liveUrl: {type:String},
  repoUrl: {type:String},
  postUrl: {type:String},
  status:{type:String},
  startDate: { type: Date, },
  endDate: { type: Date, },
  type:{ type: String, },
  title:{ type: String, },
  notionPageId:{ type: String,}
});

const ProjectsDB = mongoose.model('ProjectsDB', projectsSchema);

module.exports = ProjectsDB;
