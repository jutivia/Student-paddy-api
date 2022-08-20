const mongoose = require('mongoose')
const FollowerSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  followingId: mongoose.Types.ObjectId,
  nameOfFollowed: String,
  profilePic: String,
});

module.exports = mongoose.model("UserFollower", FollowerSchema);