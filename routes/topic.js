const express = require("express");
const router = express.Router();

const {
  getAllTopics,
  getAllPostsUnderATopic,
  getAllQuestionsUnderATopic,
  getAllcontributorsUnderATopic,
} = require("../controllers/topic");

router.post("/", getAllTopics);
router.delete("/topic/posts", getAllPostsUnderATopic);
router.get("/topic/questions", getAllQuestionsUnderATopic);
router.get("/topic/contributors", getAllcontributorsUnderATopic);

module.exports = router;
