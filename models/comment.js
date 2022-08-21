const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema(
  {
    postId: mongoose.Types.ObjectId,
    hasParent: Boolean,
    parentId: mongoose.Types.ObjectId,
    comment: String,
    UserDetails: {
      fullname: String,
      username: String,
      university: String,
      profilePic: String,
      userId: mongoose.Types.ObjectId,
    },
    childrenComents: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);