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
  data: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
