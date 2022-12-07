const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  schema: {
    type: Array,
  },
  data: {
    type: Array,
  },
  number: {
    type: Number,
  },
  userId: {
    type: String,
  },
  projectId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Resource", resourceSchema);

return resourceSchema;
