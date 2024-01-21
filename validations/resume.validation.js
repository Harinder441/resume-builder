const Joi = require("joi");
const ResumeBody = {
  body: Joi.object().keys({
    personalInfo:Joi.object().required(),
    links:Joi.object().required(),
    education:Joi.object().required(),
    skills:Joi.object().required(),
    projects:Joi.object().required(),
    experiences:Joi.object().required(),
    honorsAwards:Joi.object().required(),
    title:Joi.string().required()
  })
}

module.exports = {
 ResumeBody
}