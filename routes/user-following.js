const express = require("express");
const router = express.Router();

const {
  followUser,
  unFollowUser,
  getAllFollowersForUser,
  getAllFollowingsForUser,
} = require("../controllers/user-following");

router.post("/follow/:followingId", followUser);
router.delete("/unfollow/:followingId", unFollowUser);
router.get("/followers", getAllFollowersForUser);
router.get("/following", getAllFollowingsForUser);

module.exports = router;
