const Resource = require("../models/Resource");

module.exports.trackAPIRequest = async (id, newAnalytics) => {
  try {
    const resource = await Resource.findById(id);
    // console.log("Response", resource);
    const existingAnalytics = resource.analytics || [];
    resource.set({
      ...resource,
      analytics: [...existingAnalytics, newAnalytics],
    });
    await resource.save();
  } catch (err) {
    console.log(err);
  }
};
