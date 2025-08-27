const Resource = require("../models/Resource");

// module.exports.trackAPIRequest = async (id, newAnalytics) => {
//   try {
//     const resource = await Resource.findById(id);
//     // console.log("Response", resource);
//     const existingAnalytics = resource.analytics || [];
//     resource.set({
//       ...resource,
//       analytics: [...existingAnalytics, newAnalytics],
//     });
//     await resource.save();
//   } catch (err) {
//     console.log(err);
//   }
// };

// Middleware to track API requests
app.use((req, res, next) => {
  const endpoint = req.originalUrl;
  const fieldName = req.query.fieldName; // Assuming fieldName is passed as a query parameter
  EndpointRequest.findOneAndUpdate(
    { fieldName, endpoint },
    { $push: { requestHistory: { date: new Date() } } },
    { upsert: true, new: true }
  ).exec((err, endpointRequest) => {
    if (err) {
      console.error("Error updating request history:", err);
    } else {
      console.log(
        `Request history for ${endpointRequest.fieldName}.${endpoint}:`,
        endpointRequest.requestHistory
      );
    }
  });
  next();
});
