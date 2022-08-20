const mongoose = require("mongoose");

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
