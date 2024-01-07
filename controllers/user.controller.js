
const User = require("../models/user.model.js");
const registerUser = async (req, res) => {
  try {
    const { validatedUser } = req;
    const existingUser = await User.findOne({
      $or: [
        { username: validatedUser.username },
        { email: validatedUser.email },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Failed to create new user",
        reason: "Already Exists in DB",
      });
    }

    const newUser = new User(validatedUser);

    await newUser.save();

    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error creating new user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getAll = async (req, res) => {
  try {
  
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No Users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getByUserName = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found!', username });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by username:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
module.exports = {
  registerUser,getAll,getByUserName
};
