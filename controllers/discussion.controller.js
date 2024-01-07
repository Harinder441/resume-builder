const Discussion = require('../models/discussion.model');
const User = require('../models/user.model');

const createDiscussion = async (req, res) => {
  try {
    const { title, author, content } = req.body;
    const newDiscussion = new Discussion({
      title,
      author,
      content,
    });
    await newDiscussion.save();
    res.status(200).json(newDiscussion);
  } catch (error) {
    console.error('Error creating new discussion:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
const getAll = async (req, res) => {
  try {
  
    const discussions = await Discussion.find();

    if (discussions.length === 0) {
      return res.status(404).json({ message: "No discussions found" });
    }

    res.status(200).json(discussions);
  } catch (error) {
    console.error("Error fetching all discussion:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getByUserName = async (req, res) => {
  try {
    const { username } = req.params;

    const discussion = await Discussion.find({ username });

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found!', username });
    }

    res.status(200).json(discussion);
  } catch (error) {
    console.error('Error fetching discussion by username:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getByID = async (req, res) => {
  try {
    const { id } = req.params;

    const discussion = await Discussion.findOne({ _id:id });

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found!', id });
    }

    res.status(200).json(discussion);
  } catch (error) {
    console.error('Error fetching discussion by Id:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const deleteDiscussion = async (req, res) => {
  const { id } = req.params;
  const { author } = req.body;

  try {
    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.author !== author) {
      return res.status(403).json({ message: 'Unauthorized Access' });
    }

    const deletedDiscussion = await Discussion.findByIdAndDelete(id);

    res.status(200).json(deletedDiscussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to verify author' });
  }
};

const patchDiscussion = async (req, res) => {
  const { id } = req.params;
  const { author, ...updateData } = req.body;

  try {
    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    if (discussion.author !== author) {
      return res.status(403).json({ message: 'Unauthorized Access' });
    }

    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } 
    );

    res.status(200).json(updatedDiscussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to verify author' });
  }
};
const updateDiscussionComment = async (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  try {
    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    const isUserExist = await User.findOne({username:author});
    if (!isUserExist) {
      return res.status(404).json({ message: 'User Not found' });
    }

    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      id,
      { $push: { comments: { author, content } } },
      { new: true }
    );

    res.status(200).json(updatedDiscussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createDiscussion,getByUserName,getByID,deleteDiscussion,getAll,patchDiscussion,updateDiscussionComment
};