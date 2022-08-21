const express = require("express");
const router = express.Router();

const {
  fillUserDetails,
  followCommunity,
  unfollowCommunity,
  followTopic,
  unfollowTopic,
} = require("../controllers/userActions");
router.post("/", fillUserDetails);
router.route("/community/follow/:communityId").patch(followCommunity);
router.route("/community/unfollow/:communityId").patch(unfollowCommunity);
router.route("/topic/follow/:topicId").patch(followTopic);
router.route("/topic/unfollow/:topicId").patch(unfollowTopic);


module.exports = router;
