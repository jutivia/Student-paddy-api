const express = require("express");
const router = express.Router();

const {
  createComment,
  createSubComment,
  getMainComments,
  getSubComments,
} = require("../controllers/comment");

router.route("/:postId").post(createComment).get(getMainComments);
router.route("/:postId/subComments/:commentId").post(createSubComment).get(getSubComments);

module.exports = router;
