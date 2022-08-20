const mongoose = require('mongoose')

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);