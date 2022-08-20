const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  community: [mongoose.Types.ObjectId],
  contributions: {
    type: Number,
    default: 0,
  },
  followers: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Topic", TopicSchema);
