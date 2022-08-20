const express = require("express");
const router = express.Router();

const {
  createCommunity,
  getAllCommunities,
  getAllPostsForEachCommunity,
  getAllQuestionsForEachCommunity,
  getAllResourcesForEachCommunity,
  getAllTopicsByCommunityId,
  getAllcontributorsByCommunityId,
  getAllFollowersByCommunityId,
} = require("../controllers/community");

router.route("/").post(createCommunity).get(getAllCommunities);
router.get("/posts/:communityId", getAllPostsForEachCommunity)
router.get("/questions/:communityId", getAllQuestionsForEachCommunity);
router.get("/resources/:communityId", getAllResourcesForEachCommunity);
router.get("/topics/:communityId", getAllTopicsByCommunityId);
router.get("/contributors/:communityId", getAllcontributorsByCommunityId);
router.get("/followers/:communityId", getAllFollowersByCommunityId);


module.exports = router;
