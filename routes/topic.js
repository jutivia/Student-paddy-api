const express = require("express");
const router = express.Router();

const {
  getAllTopics,
  getAllPostsUnderATopic,
  getAllQuestionsUnderATopic,
  getAllResourcesUnderATopic,
  getAllcontributorsUnderATopic,
} = require("../controllers/topic");

router.get("/", getAllTopics);
router.get("/posts", getAllPostsUnderATopic);
router.get("/questions", getAllQuestionsUnderATopic);
router.get("/resources", getAllResourcesUnderATopic);
router.get("/contributors", getAllcontributorsUnderATopic);

module.exports = router;
