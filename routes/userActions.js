const express = require("express");
const router = express.Router();

const {
  fillUserDetails,
  followCommunity,
  unfollowCommunity,
  followTopic,
  unfollowTopic,
  getSingleUser,
  getAllusers,
} = require("../controllers/userActions");

router.post("/", fillUserDetails);
router.patch("/community/follow/:communityId").patch(followCommunity);
router.route("/community/unfollow/:communityId").patch(unfollowCommunity);
router.route("/topic/follow/:topicId").patch(followTopic);
router.route("/topic/unfollow/:topicId").patch(unfollowTopic);
router.get("/single", getSingleUser);
router.get("/allusers", getAllusers);

module.exports = router;
