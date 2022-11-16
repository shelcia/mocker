const router = require("express").Router();
const Resource = require("../../models/Resource");

router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    res.status(200).send({ status: "200", message: resource.data });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.get("/:id/:objectId", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    const response = resource.data.filter(
      (item) => item.id === req.params.objectId
    );
    res.status(200).send({ status: "200", message: response });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    //   const response = resource.data.filter(
    //     (item) => item.id === req.params.objectId
    //   );
    const body = [...resource.data, req.body];
    resource.set(body);
    await resource.save();

    res.status(200).send({ status: "200", message: "Successfully Added" });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.delete("/:id/:objectId", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    const required = resource.data.filter(
      (item) => item.id !== req.params.objectId
    );
    // const body = [...resource.data, req.body];
    resource.set(required);
    await resource.save();

    res.status(200).send({ status: "200", message: "Successfully Deleted" });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

module.exports = router;
