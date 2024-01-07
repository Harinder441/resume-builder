const express = require("express");
const router = express.Router();
const DiscussionController = require("../controllers/discussion.controller");
const DiscussionMiddleware = require("../middlewares/discussion.middleware");
const checkApiKey = require("../middlewares/checkApiKey.middleware.js");

router.post(
  "/new",
  DiscussionMiddleware.validateDiscussion,
  DiscussionMiddleware.fetchUserInCollection,
  DiscussionController.createDiscussion
);
router.get("/all", checkApiKey, DiscussionController.getAll);
router.get("/user/:user", DiscussionController.getByUserName);
router.get("/id/:id", DiscussionController.getByID);
router.delete('/id/:id', DiscussionController.deleteDiscussion);
router.patch('/id/:id', DiscussionController.patchDiscussion);
router.put('/:id/comment', DiscussionController.updateDiscussionComment);

module.exports = router;
