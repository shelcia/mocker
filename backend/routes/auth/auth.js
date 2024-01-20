const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const nodemailer = require("nodemailer");
const feLink = require("../../feLink");
const verificationTemplate = require("../../templates/verificationTemplate");

const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");

//VALIDATION OF USER INPUTS PREREQUISITES
const Joi = require("joi");
let authMiddleWare = require("../../middleware/authenticate");
//AUTHORISATION RELATED API

const registerSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});
// adding another route to check that the user has a valid json web token
router.get("/verify", authMiddleWare, (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});
router.post("/register", async (req, res) => {
  try {
    //CHECK IF MAIL ALREADY EXISTS
    const emailExist = await User.findOne({ email: { $eq: req.body.email } });
    if (emailExist) {
      res.status(200).send({ status: "400", message: "Email Already Exists" });
      return;
    }

    //HASHING THE PASSWORD

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    //VALIDATION OF USER INPUTS

    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(200).send({ status: "500", message: error });
    }
    //THE USER IS ADDED
    await user.save();
    //GENERATE TOKEN
    const encryptedString = cryptr.encrypt(req.body.email);

    const link = `${feLink}verification/${encryptedString}`;
    // console.log(process.env.EMAIL, process.env.PASSWORD);

    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PWD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: req.body.email,
      subject: `Activation mail for Mocker`,
      html: verificationTemplate(link),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        // res.status(401).send("error");
        res.status(200).send({ status: "401", message: "Error" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send({ status: "200", message: "User Created" });
      }
    });
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

//SIGNIN USER

router.post("/signin", async (req, res) => {
  //CHECKING IF EMAIL EXISTS

  const user = await User.findOne({ email: { $eq: req.body.email } });
  if (!user) {
    res.status(200).send({ status: "400", message: 'Email doesn"t exist' });
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    res.status(200).send({ status: "400", message: "Incorrect Password !!!" });
    return;
  }

  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) {
      res.status(200).send({ status: "400", message: error });
      return;
    } else {
      //CREATE TOKEN
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60, // exp after 7 days
        },
        process.env.TOKEN_SECRET
      );

      res
        .status(200)
        .header("auth-token", token)
        .send({
          status: "200",
          message: {
            token: token,
            userId: user._id,
            email: user.email,
            emailVerified: user.emailVerified,
          },
        });
    }
  } catch (error) {
    res.status(200).send({ status: "500", error });
  }
});

router.put("/verification/:id", async (req, res) => {
  // console.log(req.params.id);
  const decryptedString = cryptr.decrypt(req.params.id);
  const query = await User.where({ email: decryptedString });
  try {
    if (query.length === 0) {
      res.status(200).send({ status: "400", message: "Invalid String" });
      return;
    }
    const activate = await User.findById(query[0]._id).exec();
    activate.set({ emailVerified: true });
    // console.log("verified");
    await activate.save();
    res.status(200).send({ status: "200", message: "Account Verified !" });
  } catch (error) {
    res.status(200).send({ status: "400", message: "Verification failed" });
  }
});

module.exports = router;
