const Joi = require("joi");
const syncMap = {
  body: Joi.object().keys({
    modelName: Joi.string().required(),
    columnMapObject: Joi.object().required(),
    NotionDBId: Joi.string().required(),
  }),
};

module.exports = {
  syncMap
};
