const mongoose = require('mongoose');
const UpvoteSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
})

module.exports = mongoose.model("Upvote", UpvoteSchema);