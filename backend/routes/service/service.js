const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const crypto = require('crypto')
const User = require('../../models/User')

router.post('/verify_email', async(req, res)=>{
    const {email} = req.body.user
    const {fEndUrl} = req.body

    //GENERATE TOKEN
    const token = await new Promise(async(resolve, reject)=>{
        try {
            //GENERATE PSEUDO RANDOM STRING FOR EXTRA SECURE TOKEN (OPTIONAL)
            let randomString = crypto.randomBytes(16).toString()

            //SIGN
            let signedToken = jwt.sign({
                randomness: randomString,
                ...req.body.user
            }, process.env.TOKEN_SECRET)

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
        text: `click on the link to verify:
        ${req.body.fEndUrl}/emailverify/?auth=${token}&ref=${req.body.currentHref}`
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

router.post('/am_i_email_verified', async(req,res)=>{
    let user;
    try {
        user = await User.findById(req.body.user._id)
        
    } catch (error) {
        console.log(error)
        return res.send({
            status: "400",
            message: 'Something wrong'
        })
    }
    if(!user){
        return res.status(200).send({
            status: "400",
            message: 'User_id doesn"t exist'
        });
    }
    
    return res.send({
        status: "200",
        message: user.emailVerified?'true':'false'
    })

})

module.exports = router