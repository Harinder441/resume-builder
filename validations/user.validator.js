const Joi = require('joi');

const userValidationSchema = Joi.object({
  fullName: Joi.string().max(50).default(''),
  username: Joi.string().max(25).required(),
  email: Joi.string().email().required(),
});


const validateUser = (req, res, next) => {
  const { error, value } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Invalid request body', error: error.details });
  }
  req.validatedUser = value;
  next();
};

module.exports = {
  userValidationSchema,
  validateUser,
};
