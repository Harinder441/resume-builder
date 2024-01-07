const Joi = require('joi');

const commentSchema = Joi.object({
  author: Joi.string().required(),
  content: Joi.string().required(),
});

module.exports = commentSchema;