const express = require("express");
const router = express.Router();

const {
  fillUserDetails,
  followCommunity,
  unfollowCommunity,
} = require("../controllers/userActions");
router.post("/:userId", fillUserDetails);
router.route("/:userId/follow/:communityId").patch(followCommunity);
router.route("/:userId/unfollow/:communityId").patch(unfollowCommunity);


module.exports = router;
