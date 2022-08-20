const express = require("express");
const router = express.Router();

const {
  createCommunity,
  getAllCommunities,
  followCommunity,
  unFollowCommunity,
} = require("../controllers/community");

router.route("/").post(createCommunity).get(getAllCommunities);
router.route("/:id").post(followCommunity);


module.exports = router;
