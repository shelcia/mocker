const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Verification = require("../../models/Verification");

const { v4: uuidv4 } = require("uuid");

const nodemailer = require('nodemailer');
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth :{
    user : process.env.AUTH_EMAIL,
    pass : process.env.AUTH_PASS,
  }
})

transporter.verify((err,suc)=>{
  if(err){
    console.log(err);
  }else{
    console.log("Ready For Message");
    console.log(suc);
  }
})

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
    verified: false,
  });

  const sendVerificationEmail = ({_id,email},response) => {
    const currentUrl = 'http://localhost:3000';

    const uniqueString = uuidv4() + _id;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Verify your email address to complete the signup process and login to your account</p><p>This link <b>expires in 1 hour</b></p><p>Press <a href=${currentUrl + "signin/verify"+ _id + "/" + uniqueString}></a> to proceed</p>`,

    }

    const saltRounds = 10;
    bcrypt
    .hash(uniqueString,saltRounds)
    .then((hashedUniqueString)=>{
      const newVerification = new Verification({
        userID: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      })
      newVerification
      .save()
      .then(()=>{
        transporter
        .sendMail(mailOptions)
        .then(()=>{
          res.json({
            status: "PENDING",
            message: "Verification Email Sent",
          })
        })
        .catch((err)=>{
          res.status(404).send(
            {
              status:"404",
              message: err
            }
          )
        })
      })
      .catch((err)=>{
        console.log(err);
        res.status(404).send(
          {
            status:"404",
            message: err
          }
        )
      })
    })
    .catch((err)=>{
      res.status(404).send(
        {
          status:"404",
          message: err
        }
      )
    })
  };

  router.get("/verify/:userID/:uniqueString",(req,res)=>{
    let {userID,uniqueString} = req.params;
    Verification
    .find({userID})
    .then((result)=>{
      if(result.length >0){

        const {expiresAt} = result[0];
        const hashedUniqueString = result[0].uniqueString;

        if(expiresAt<Date.now()){
          Verification.deleteOne({userID})
          .then(result=>{
            User.deleteOne({_id: userID})
            .then(()=>{
              console.log("Signup Again , Time Expired!");
              res.redirect('/signup');
            })
            .catch(err=>{
              console.log("Email Not Verified.");
              res.redirect('/login');
            })
          })
          .catch((err)=>{
            console.log("Email Not Verified.");
            res.redirect('/login');
          })
        }
        else{
          bcrypt.compare(uniqueString,hashedUniqueString)
          .then(result =>{
            if(result){
              User.updateOne({_id: userID},{verified: true})
              .then(()=>{
                Verification.deleteOne({userID})
                .then(()=>{
                  console.log("Verified Congratulations !!");
                })
                .catch()
                {
                  console.log("Email Not Verified.");
                  res.redirect('/login');
                }
              })
              .catch(err=>{
                console.log("Email Not Verified.");
                res.redirect('/login');
              })
            }else{
              console.log("Email Not Verified.");
              res.redirect('/login');
            }
          })
          .catch(err=>{
            console.log("Email Not Verified.");
            res.redirect('/login');
          })
        }
      
      }else{
        console.log("Email Not Verified.");
        res.redirect('/login');
      }
    })
    .catch((err)=>{
      console.log("Email Not Verified.");
      res.redirect('/login');
    })
  })


  try {
    //VALIDATION OF USER INPUTS

    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(200).send({ status: "500", message: error });
    }
    //THE USER IS ADDED
    else {
      await user.save();
      sendVerificationEmail(user,response);
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

  if(!user[0].verified){
    console.log('user not verified , please verify and try again');
    res.redirect('signup');
  }
  else{

  

  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) {
      res.status(200).send({ status: "400", message: error });
      return;
    } else {
      //CREATE TOKEN
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
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
}});

module.exports = router;
