const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  projectId: {
    type: String,
  },
  resourceId: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
