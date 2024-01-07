const Joi = require('joi');
const commentSchema = require('./commentSchema');

const discussionValidationSchema = Joi.object({
  title: Joi.string().max(150).required(),
  author: Joi.string().required(),
  content: Joi.string().default(''),
  comments: Joi.array().items(commentSchema).default([]),

});

module.exports = discussionValidationSchema;