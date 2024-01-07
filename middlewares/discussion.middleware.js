const User = require('../models/user.model');

const fetchUserInCollection = async (req, res, next) => {
  const { author } = req.body;

  try {
    const user = await User.findOne({ username: author });

    if (!user) {
      return res.status(404).json({ message: 'User not found', author });
    }

    next();
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

const validateDiscussion = (req, res, next) => {
  const { error } = require('../validations/discussion.validator').validate(req.body);

  if (error) {
    return res.status(422).json({ message: 'Invalid request body', error: error.details });
  }

  next();
};

module.exports = {
  fetchUserInCollection,
  validateDiscussion,
};