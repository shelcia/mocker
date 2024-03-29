const router = require("express").Router();
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");

const Resource = require("../../models/Resource");

const { specialCharacter } = require("../../utils/customFaker");

// more can be added
const fakerFuncs = (item, option) => {
  switch (item) {
    case "firstName":
      return faker.name.firstName(
        option?.gender //"female" | "male"
      );
    case "lastName":
      return faker.name.lastName(
        option?.gender //"female" | "male"
      );
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
      return faker.commerce.price(
        parseInt(option ? option.min : 1), // number
        parseInt(option ? option.max : 1000) // number
      );
    case "productAdjective":
      return faker.commerce.productAdjective();

    case "boolean":
      return faker.datatype.boolean();
    case "array":
      return faker.datatype.array(parseInt(option?.length));
    case "bigInt": //@throws — When options define max < min
      return faker.datatype
        .bigInt({
          min: option ? parseInt(option.min) : undefined,
          max: option ? parseInt(option.max) : undefined,
        })
        .toString();
    case "datetime":
      return faker.datatype.datetime({
        min: option ? parseInt(option.min) : undefined,
        max: option ? parseInt(option.max) : undefined,
      });
    case "float":
      return faker.datatype.float({
        min: option ? parseInt(option.min) : undefined,
        max: option ? parseInt(option.max) : undefined,
        precision: option ? parseFloat(option.precision) : undefined,
      });
    case "hexadecimal":
      return faker.datatype.hexadecimal({
        //case?: "lower" | "upper" | "mixed" | undefined;
        length: option ? parseInt(option.length) : undefined,
        case: option?.case,
        prefix: option?.prefix,
      });
    case "json":
      return faker.datatype.json();
    case "number":
      return faker.datatype.number({
        //@throws — When options define max < min
        min: option ? parseInt(option.min) : undefined,
        max: option ? parseInt(option.max) : undefined,
        precision: option ? parseFloat(option.precision) : undefined,
      });
    case "string":
      return faker.datatype.string(
        option ? parseInt(option.length) : undefined
      );
    case "uuid":
      return faker.datatype.uuid();

    case "between":
      return faker.date.between(option?.from, option?.to);
    case "betweens":
      return faker.date.betweens(
        option?.from,
        option?.to,
        option ? parseInt(option.num) : undefined
      );
    case "birthdate":
      return faker.date.birthdate({
        min: option ? parseInt(option?.min) : undefined,
        max: option ? parseInt(option?.max) : undefined,
        mode: option?.mode, //mode?: "age" | "year" | undefined
      });
    case "future":
      return faker.date.future(option?.years);
    case "month":
      return faker.date.month({
        abbr: option ? (option.abbr === "true" ? true : false) : undefined,
      });
    case "past":
      return faker.date.past(
        option?.years //number
      );
    case "recent":
      return faker.date.recent(
        option ? parseInt(option.days) : undefined,
        option?.refDate
      );
    case "soon":
      return faker.date.soon(
        option ? parseInt(option.days) : undefined,
        option?.refDate
      );
    case "weekday":
      return faker.date.weekday({
        abbr: option ? (option.abbr === "true" ? true : false) : undefined,
      });
    case "lines":
      return faker.lorem.lines(
        option?.count //number
      );
    case "domainName":
      return faker.internet.domainName();

    //add options later
    case "email":
      return faker.internet.email(
        option?.firstName, //string
        option?.lastName, //string
        option?.provider //string
      );

    case "imageUrl":
      return faker.image.imageUrl(
        option?.width, //number
        option?.height, //number
        option?.category //string
      );
    case "sentences":
      return faker.lorem.sentences(option?.sentenceCount);

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

    case "alpha":
      return faker.random.alpha(parseInt(option ? option.count : 5));
    case "alphaNumeric":
      return faker.random.alphaNumeric(option?.count);
    case "locale":
      return faker.random.locale();
    case "numeric":
      return faker.random.numeric(option?.count);
    case "word":
      return faker.random.word();
    case "words":
      return faker.random.words(option?.count);
    case "specialCharacter":
      return specialCharacter({
        length: option?.count,
        whitelist: option?.whitelist,
      });

    case "bicycle":
      return faker.vehicle.bicycle();
    case "color":
      return faker.vehicle.color();
    case "fuel":
      return faker.vehicle.fuel();
    case "manufacturer":
      return faker.vehicle.manufacturer();
    case "model":
      return faker.vehicle.model();
    case "type":
      return faker.vehicle.type();
    case "vehicle":
      return faker.vehicle.vehicle();
    case "vin":
      return faker.vehicle.vin();
    case "vrm":
      return faker.vehicle.vrm();

    case "buildingNumber":
      return faker.address.buildingNumber();
    case "cardinalDirection":
      return faker.address.cardinalDirection(
        option ? (option.useAbbr === "true" ? true : false) : undefined
      );
    case "city":
      return faker.address.city();
    case "cityName":
      return faker.address.cityName();
    case "cityPrefix":
      return faker.address.cityPrefix();
    case "citySuffix":
      return faker.address.citySuffix();
    case "country":
      return faker.address.country();
    case "countryCode":
      return faker.address.countryCode(option?.alphaCode);
    case "county":
      return faker.address.county();
    case "direction":
      return faker.address.direction(
        option ? (option.useAbbr === "true" ? true : false) : undefined
      );
    case "latitude":
      return faker.address.latitude(
        option ? parseInt(option.max) : undefined,
        option ? parseInt(option.min) : undefined,
        option ? parseInt(option.precision) : undefined
      );
    case "longitude":
      return faker.address.longitude(
        option ? parseInt(option.max) : undefined,
        option ? parseInt(option.min) : undefined,
        option ? parseInt(option.precision) : undefined
      );
    case "nearbyGPSCoordinate":
      return faker.address.nearbyGPSCoordinate(
        option && option.latitude && option.longitude
          ? [parseInt(option.latitude), parseInt(option.longitude)]
          : undefined,
        option?.radius,
        option ? (option.metric === "KM" ? true : false) : undefined
      );
    case "ordinalDirection":
      return faker.address.ordinalDirection(
        option ? (option.useAbbr === "true" ? true : false) : undefined
      );
    case "secondaryAddress":
      return faker.address.secondaryAddress();
    case "state":
      return faker.address.state();
    case "stateAbbr":
      return faker.address.stateAbbr();
    case "street":
      return faker.address.street();
    case "streetAddress":
      return faker.address.streetAddress(
        option ? (option.useFullAddress === "true" ? true : false) : undefined
      );
    case "streetName":
      return faker.address.streetName();
    case "streetPrefix":
      return faker.address.streetPrefix();
    case "streetSuffix":
      return faker.address.streetSuffix();
    case "timeZone":
      return faker.address.timeZone();
    case "zipCode":
      return faker.address.zipCode(option?.format);
    case "zipCodeByState":
      return faker.address.zipCodeByState(option?.state);

    case "abbreviation":
      return faker.hacker.abbreviation();
    case "adjective":
      return faker.hacker.adjective();
    case "ingverb":
      return faker.hacker.ingverb();
    case "noun":
      return faker.hacker.noun();
    case "phrase":
      return faker.hacker.phrase();
    case "verb":
      return faker.hacker.verb();

    case "commonFileExt":
      return faker.system.commonFileExt();
    case "commonFileName":
      return faker.system.commonFileName(option?.ext);
    case "commonFileType":
      return faker.system.commonFileType();
    case "cron":
      return faker.system.cron();
    case "directoryPath":
      return faker.system.directoryPath();
    case "fileExt":
      return faker.system.fileExt();
    case "fileName":
      return faker.system.fileName({
        extensionCount: option ? parseInt(option.extensionCount) : undefined,
      });
    case "filePath":
      return faker.system.filePath();
    case "fileType":
      return faker.system.fileType();
    case "mimeType":
      return faker.system.mimeType();
    case "networkInterface":
      return faker.system.networkInterface({
        interfaceSchema: option?.interfaceSchema,
        interfaceType: option?.interfaceType,
      });
    case "semver":
      return faker.system.semver();

    case "collation":
      return faker.database.collation();
    case "column":
      return faker.database.column();
    case "engine":
      return faker.database.engine();
    case "mongodbObjectId":
      return faker.database.mongodbObjectId();
    case "databaseType":
      return faker.database.type();

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
      try {
        schema = {
          ...schema,
          [item.label]: fakerFuncs(item.field, item.option),
        };
      } catch (error) {
        schema = { ...schema, [item.label]: fakerFuncs(item.field) };
      }
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
        try {
          schema = {
            ...schema,
            [item.label]: fakerFuncs(item.field, item.option),
          };
        } catch (error) {
          schema = { ...schema, [item.label]: fakerFuncs(item.field) };
        }
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

router.delete("/", async (req, res) => {
  for (const id of req.body.resources) {
    try {
      await Resource.findOneAndDelete({ _id: { $eq: id } });
    } catch (error) {
      res.status(200).send({ status: "500", message: "Failed to delete" });
      return;
    }
  }
  res.status(200).send({ status: "200", message: "Deleted" });
});

module.exports = router;
