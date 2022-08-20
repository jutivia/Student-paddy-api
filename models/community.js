const mongoose = require('mongoose');
const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
        required: [true, "Provide a community name"],
    unique: true,
  },
  about: {
    type: String,
    required: [true, "Provide a community summary"],
  },
  img: {
    type: String,
    required: [true, "Provide the cummunity image URL"],
  },
  followers: {
    type: Number,
    default: 0,
  },
  topics: {
    type: Number,
    default: 0,
  },
  contributors: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model('Community', CommunitySchema)