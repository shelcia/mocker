const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: String,
    // required: true,
  },
  projectId: {
    type: String,
    // required: true,
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
