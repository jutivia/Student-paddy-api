const mongoose = require("mongoose");
const DownvoteSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
});

module.exports = mongoose.model("Downvote", DownvoteSchema);
