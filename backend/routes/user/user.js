const router = require("express").Router();
// const Joi = require("joi");
const Resource = require("../../models/Resource");
const { v4: uuidv4 } = require("uuid");
// const { trackAPIRequest } = require("../../utils/trackAPIRequests");

router.get("/:id", async (req, res) => {
  // const existingAnalytics = resource.analytics || [];

  // const newAnalytics = {
  //   method: "GET",
  //   date: Date.now(),
  // };

  // await resource.set({
  //   ...req.body,
  //   analytics: [...existingAnalytics, newAnalytics],
  // });
  // console.log(existingAnalytics);
  // const body = {
  //   name: resource.name,
  //   schema: resource.schema,
  //   data: resource.data,
  //   number: resource.number,
  //   userId: resource.userId,
  //   projectId: resource.projectId,
  //   analytics: [
  //     ...existingAnalytics,
  //     {
  //       method: "GET",
  //       date: Date.now(),
  //     },
  //   ],
  // };
  // resource.set(body);
  // await resource.save();

  try {
    // await trackAPIRequest(req.params.id, {
    //   method: "GET",
    //   date: Date.now(),
    // });
    const resource = await Resource.findById(req.params.id);
    if(resource === null){
      res.status(200).send({
        status: "400",
        message: 'Seems like resourceId doesn"t exist !',
      });
      return;
    }
    res.status(200).send({ status: "200", message: resource.data });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.get("/:id/:objectId", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if(resource === null){
      res.status(200).send({
        status: "400",
        message: 'Seems like resourceId doesn"t exist !',
      });
      return;
    }
    const response = resource.data.filter(
      (item) => item.id === req.params.objectId
    );
    if (response.length === 0) {
      res.status(200).send({
        status: "400",
        message: 'Seems like objectId doesn"t exist !',
      });
      return;
    }
    res.status(200).send({ status: "200", message: response });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    if (typeof req.body !== "object") {
      res.status(200).send({
        status: "400",
        message: "Wrong format",
      });
      return;
    }

    const resource = await Resource.findById(req.params.id);
    if(resource === null){
      res.status(200).send({
        status: "400",
        message: 'Seems like resourceId doesn"t exist !',
      });
      return;
    }
    const requiredLabel = resource.schema.map((item) => item.label);

    const reqLabel = Object.keys(req.body);

    if (
      requiredLabel
        .map((label) => (reqLabel.includes(label) ? true : false))
        .includes(false)
    ) {
      res.status(200).send({
        status: "400",
        message: "Some fields appear to be mismatched (check the schema)",
      });
      return;
    }

    if (reqLabel.length !== requiredLabel.length) {
      res.status(200).send({
        status: "400",
        message: "Some fields seems to be extra/missing",
      });
    }

    const newData = { ...req.body, id: uuidv4() };

    const body = {
      name: resource.name,
      schema: resource.schema,
      data: [...resource.data, newData],
      number: resource.number + 1,
      userId: resource.userId,
      projectId: resource.projectId,
    };

    resource.set(body);
    await resource.save();
    res.status(200).send({ status: "200", message: "Successfully Added !" });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.put("/:id/:objectId", async (req, res) => {
  try {
    if (typeof req.body !== "object") {
      res.status(200).send({
        status: "400",
        message: "Wrong format",
      });
      return;
    }

    const resource = await Resource.findById(req.params.id);
    if(resource === null){
      res.status(200).send({
        status: "400",
        message: 'Seems like resourceId doesn"t exist !',
      });
      return;
    }
    const requiredLabel = resource.schema.map((item) => item.label);

    const reqLabel = Object.keys(req.body);

    if (
      requiredLabel
        .map((label) => (reqLabel.includes(label) ? true : false))
        .includes(false)
    ) {
      res.status(200).send({
        status: "400",
        message: "Some fields appear to be mismatched (check the schema)",
      });
      return;
    }

    if (reqLabel.length !== requiredLabel.length) {
      res.status(200).send({
        status: "400",
        message: "Some fields seems to be extra/missing",
      });
    }

    const response = resource.data.map((item) => {
      if (item.id === req.params.objectId) {
        return { ...req.body, id: uuidv4() };
      }
      return item;
    });

    if (response.length === 0) {
      res.status(200).send({
        status: "400",
        message: 'Seems like objectId doesn"t exist !',
      });
      return;
    }

    const body = {
      name: resource.name,
      schema: resource.schema,
      data: response,
      number: resource.number,
      userId: resource.userId,
      projectId: resource.projectId,
    };

    resource.set(body);
    await resource.save();
    res.status(200).send({ status: "200", message: "Successfully Edited !" });
    // res.status(200).send({ status: "200", message: body });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.delete("/:id/:objectId", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if(resource === null){
      res.status(200).send({
        status: "400",
        message: 'Seems like resourceId doesn"t exist !',
      });
      return;
    }
    const required = resource.data.filter(
      (item) => item.id !== req.params.objectId
    );

    if(required.length === resource.data.length){
      res.status(200).send({
        status: "400",
        message: 'Seems like objectId doesn"t exist !',
      });
      return;
    }

    const body = {
      name: resource.name,
      schema: resource.schema,
      data: required,
      number: resource.number,
      userId: resource.userId,
      projectId: resource.projectId,
    };
    resource.set(body);
    await resource.save();

    // res.status(200).send({ status: "200", message: body });
    res.status(200).send({ status: "200", message: "Successfully Deleted" });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

module.exports = router;
