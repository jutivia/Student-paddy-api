const express = require("express");
const router = express.Router();

const {
  followUser,
  unFollowUser,
  getAllFollowersForUser,
  getAllFollowingsForUser,
} = require("../controllers/user-following");

router.post("/:userId/follow/:followingId", followUser);
router.delete("/:userId/unfollow/:followingId", unFollowUser);
router.get("/:userId/followers", getAllFollowersForUser);
router.get("/:userId/following", getAllFollowingsForUser);

module.exports = router;
