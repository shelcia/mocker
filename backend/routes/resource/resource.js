const router = require("express").Router();
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");

const Resource = require("../../models/Resource");

// more can be added
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

    case "chemicalElement":
      return faker.science.chemicalElement();
    case "unit":
      return faker.science.unit();

    case "hsl":
      return faker.color.hsl();
    case "humanColor":
      return faker.color.human();
    case "rgb":
      return faker.color.rgb();

    case "genre":
      return faker.music.genre();
    case "songName":
      return faker.music.songName();

    case "amount":
      return faker.finance.amount();
    case "bitcoinAddress":
      return faker.finance.bitcoinAddress();
    case "creditCardCVV":
      return faker.finance.creditCardCVV();
    case "creditCardIssuer":
      return faker.finance.creditCardIssuer();
    case "creditCardNumber":
      return faker.finance.creditCardNumber();
    case "currencyName":
      return faker.finance.currencyName();
    case "currencySymbol":
      return faker.finance.currencySymbol();
    case "ethereumAddress":
      return faker.finance.ethereumAddress();
    case "transactionDescription":
      return faker.finance.transactionDescription();
    case "transactionType":
      return faker.finance.transactionType();

    case "default":
      return () => {};
  }
};

router.post("/", async (req, res) => {
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
  try {
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

router.get("/:id", async (req, res) => {
  try {
    const resources = await Resource.findById(req.params.id);
    res.status(200).send({ status: "200", message: resources });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id).exec();

    let data = [];

    for (let i = 0; i < req.body.number; i++) {
      let schema = { id: uuidv4() };
      req.body.schema.forEach((item) => {
        schema = { ...schema, [item.label]: fakerFuncs(item.field) };
      });
      data = [...data, schema];
    }

    const body = {
      name: req.body.name,
      schema: req.body.schema,
      data: data,
      number: req.body.number,
      userId: req.body.userId,
      projectId: req.body.projectId,
    };
    resource.set(body);
    await resource.save();

    res.status(200).send({ status: "200", message: "Successful" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.status(200).send({ status: "200", message: "Successful" });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

module.exports = router;
