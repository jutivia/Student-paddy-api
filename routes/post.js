const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  getAllResources,
  getAllQuestions,
  UpvoteAPost,
  RemoveUpvoteOnAPost,
  DownvoteAPost,
  RemoveDownvoteOnAPost,
} = require("../controllers/post");

router.route("/").post(createPost).get(getAllPosts);
router.route("/:postId").get(getSinglePost).delete(deletePost);
router.get("/resources", getAllResources);
router.get("/questions", getAllQuestions);
router.route("/upvote/:postId").post(UpvoteAPost).delete(RemoveUpvoteOnAPost);
router
  .route("/downvote/:postId")
  .post(DownvoteAPost)
  .delete(RemoveDownvoteOnAPost);

module.exports = router;
