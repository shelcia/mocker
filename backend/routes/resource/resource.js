const router = require("express").Router();
// import { faker } from "@faker-js/faker";
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");

const Resource = require("../../models/Resource");
// const { schema } = require("../../models/User");

const fakerFuncs = (item) => {
  switch (item) {
    case "firstName":
      return faker.name.firstName();
    case "lastName":
      return faker.name.lastName();
    case "sex":
      return faker.name.sex();
    case "jobArea":
      return faker.name.jobArea();
    case "jobTitle":
      return faker.name.jobTitle();
    case "avatar":
      return faker.image.avatar();

    case "fashion":
      return faker.image.fashion();
    case "product":
      return faker.commerce.product();
    case "productDescription":
      return faker.commerce.productDescription();
    case "price":
      return faker.commerce.price();
    case "productAdjective":
      return faker.commerce.productAdjective();

    case "boolean":
      return faker.datatype.boolean();
    case "past":
      return faker.date.past();
    case "lines":
      return faker.lorem.lines();
    case "domainName":
      return faker.internet.domainName();
    case "imageUrl":
      return faker.image.imageUrl();
    case "sentences":
      return faker.lorem.sentences(2);

    case "default":
      return () => {};
  }
};

router.post("/", async (req, res) => {
  try {
    let resource = [];

    // console.log(req.body);

    for (let i = 0; i < req.body.number; i++) {
      let schema = { id: uuidv4() };
      req.body.schema.forEach((item) => {
        schema = { ...schema, [item.label]: fakerFuncs(item.field) };
      });
      resource = [...resource, schema];
    }
    // console.log(resource);

    const body = {
      name: req.body.name,
      schema: req.body.schema,
      data: resource,
      number: req.body.number,
      userId: req.body.userId,
      projectId: req.body.projectId,
    };

    const newResource = new Resource(body);
    await newResource.save();
    // res.status(200).send({ status: "200", message: body });
    res
      .status(200)
      .send({ status: "200", message: "Successfully resource created" });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.get("/project/:id", async (req, res) => {
  try {
    const resources = await Resource.find({ projectId: req.params.id });
    res.status(200).send({ status: "200", message: resources });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const resource = await Resource.findById(req.params.id);
//     res.status(200).send({ status: "200", message: resource });
//   } catch (err) {
//     res.status(200).send({ status: "500", message: err });
//   }
// });

module.exports = router;
