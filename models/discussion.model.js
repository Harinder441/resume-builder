const mongoose = require('mongoose');
const commentSchema = require('./commentSchema');
const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 150,
  },
  author: {
    type: String,
    required: true,
    immutable: true,
  },
  content: {
    type: String,
    default: '',
  },
  comments: {
    type: [commentSchema],
    default: [],

  },
 
},{timestamps: true});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;