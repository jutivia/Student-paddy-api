const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  getAllResources,
  getAllQuestions,
} = require("../controllers/post");

router.route("/").post(createPost).get(getAllPosts);
router.route("/:postId").get(getSinglePost).delete(deletePost);
router.get("/resources", getAllResources);
router.get("/questions", getAllQuestions);
module.exports = router;
