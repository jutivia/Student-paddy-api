const express = require("express");
const router = express.Router();

const {
  fillUserDetails,
  followCommunity,
  unfollowCommunity,
  followTopic,
  unfollowTopic,
} = require("../controllers/userActions");
router.post("/:userId", fillUserDetails);
router.route("/:userId/community/follow/:communityId").patch(followCommunity);
router.route("/:userId/community/unfollow/:communityId").patch(unfollowCommunity);
router.route("/:userId/topic/follow/:topicId").patch(followTopic);
router.route("/:userId/topic/unfollow/:topicId").patch(unfollowTopic);


module.exports = router;
