const mongoose = require('mongoose')
const Upvote = require("../models/upvote");
const Downvote = require("../models/downvote");
const Comment = require("../models/comment");
const PostSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: [true, "input a title"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "input the creator id"],
    },
    type: {
      type: String,
      enums: ["question", "file", "link", "post"],
      required: [true, "Input a type"],
    },
    content: {
      type: String,
      default: null,
    },
    file: {
      type: Buffer,
      default: null,
    },
    community: [mongoose.Types.ObjectId],
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    reposts: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
PostSchema.methods.getUpvotesAndDownvotes = async function () {
  const upvotes = await Upvote.find({ postId: this._id });
  this.upvotes = upvotes ? upvotes.length : 0;
  const downvotes = await Downvote.find({ postId: this._id });
  this.downvotes = downvotes? downvotes.length: 0
  const comments = await Comment.find({ postId: this._id });
  this.comments = comments ? comments.length : 0;
  return { upvotes, downvotes, comments }
}
module.exports = mongoose.model("Post", PostSchema);