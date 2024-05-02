 
const mongoose = require('mongoose');

const syncSchema = new mongoose.Schema({
  notionPageId:{type:String},
  issueKey:{type:String},
},{timestamps:true});

const JiraSync = mongoose.model('JiraSync', syncSchema);

module.exports = JiraSync;
