 
const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // Add other fields for projects
});

const ProjectsDB = mongoose.model('ProjectsDB', projectsSchema);

module.exports = ProjectsDB;
