const mongoose = require("mongoose");

const VerficiationSchema = new mongoose.Schema({
  userID: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date,
});

module.exports = mongoose.model("Verification", VerficiationSchema);
