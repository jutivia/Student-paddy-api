const mongoose = require("mongoose");
const { countries } = require("../utils/countries");
const { universities } = require("../utils/universities");
const crpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserVerificationSchema = new mongoose.Schema(
  {
    expiresAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
    },
    uniqueString: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserVerification", UserVerificationSchema);
