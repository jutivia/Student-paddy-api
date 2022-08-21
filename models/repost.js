const mongoose = require("mongoose");
const RepostSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId, 
});

module.exports = mongoose.model("Repost", RepostSchema);
