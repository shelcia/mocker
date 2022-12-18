const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const nodemailer = require("nodemailer")

//VALIDATION OF USER INPUTS PREREQUISITES
const Joi = require("joi");

//AUTHORISATION RELATED API

const registerSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const pwdResetSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {
  //   console.log(req.body);
  //CHECK IF MAIL ALREADY EXISTS

  const emailExist = await User.findOne({ email: req.body.email });
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

  try {
    //VALIDATION OF USER INPUTS

    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(200).send({ status: "500", message: error });
    }
    //THE USER IS ADDED
    else {
      await user.save();
      res.status(200).send({ status: "200", message: "User Created" });
    }
  } catch (error) {
    res.status(200).send({ status: "500", message: error });
  }
});

//SIGNIN USER

router.post("/signin", async (req, res) => {
  //CHECKING IF EMAIL EXISTS

  const user = await User.findOne({ email: req.body.email });
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
      const token = jwt.sign({
        _id: user._id,
        email:user.email
      }, process.env.TOKEN_SECRET);

      res
        .status(200)
        .header("auth-token", token)
        .send({
          status: "200",
          message: {
            token: token,
            userId: user._id,
            email: user.email,
          },
        });
    }
  } catch (error) {
    res.status(200).send({ status: "500", error });
  }
});

router.get('/auth_token/:token/', async(req,res)=>{
  var payload = await new Promise(async(resolve, reject)=>{
    try {
        let _payload = jwt.verify(req.params.token,
                  process.env.TOKEN_SECRET)
        resolve(_payload)
        
    } catch (error) {
        console.log(error)
        return res.send({
          status: "400",
          message: 'Something wrong' })
    }
  })
  
  const user = await User.findById(payload._id)

  if (!user) {
    return res.status(200).send({
      status: "400",
      message: 'Email doesn"t exist' });
  }
  user.emailVerified = true
  user.save()
  return res.send({
    status: "200",
    message: 'Verified' })

})

//GENERATE PASSWORD RESET LINK AND SEND THROUGH EMAIL
router.post('/resetpassword', async(req,res)=>{
  const { fEndUrl, email } = req.body

  //CHECK IF EMAIL EXIST
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).send({
      status: "400",
      message: "Email does not exist"
    });
  }

  //GENERATE TOKEN
  const token = await new Promise(async(resolve, reject)=>{
    try {

        //SIGN
        let signedToken = jwt.sign({
            _id: user._id,
        }, process.env.TOKEN_SECRET, {expiresIn: 60*5})

        resolve(signedToken)
        
    } catch (error) {
        console.log(error)
        return res.send({
            status: "400",
            message: 'Something wrong' })
    }
  })


  // SEND TOKEN THROUGH EMAIL
  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PWD
      }
  });

  let mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: 'EMAIL VERIFICATION',
      text: `click on the link to verify. Link is valid for only 5 min:
      ${fEndUrl}/resetpassword/?auth=${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error.message);
      }
      return res.send({
          status: "200",
          message: `Verification link sent to ${email}. \nCheck your inbox`
      })
  });
})

//GET TOKEN AND CHANGE PASSWORD OF THE USER
//IF TOKEN IS VERIFIED
router.post('/changepassword/:token', async(req,res)=>{
  const auth_token = req.params.token
  
  var payload = await new Promise(
    async(resolve, reject)=>{
    try {
        let _payload = jwt.verify(
          auth_token,
          process.env.TOKEN_SECRET)
        resolve(_payload)
        
    } catch (error) {
        console.log(error)
        return res.send({
          status: "400",
          message: 'Something wrong'
        })
    }
  })
  
  let user;
  try {
    user = await User.findById(payload._id)
  } catch (error) {
    return res.status(200).send({
      status: "400",
      message: 'Something wrong'
    });
  }

  if (!user) {
    return res.status(200).send({
      status: "400",
      message: 'Email doesn"t exist'
    });
  }

  //HASHING THE PASSWORD

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    //VALIDATION OF USER INPUTS

    const { error } = await pwdResetSchema.validateAsync(req.body);
    if (error) {
      res.status(200).send({
        status: "500",
        message: error
      });
    }
    //THE PASSWORD IS CHANGED
    else {
      user.password = hashedPassword
      await user.save();
      res.status(200).send({
        status: "200",
        message: "Password successfully changed"
      });
    }
  } catch (error) {
    res.status(200).send({
      status: "500",
      message: error
    });
  }
})

module.exports = router;
