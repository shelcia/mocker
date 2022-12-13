const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const crypto = require('crypto')

router.post('/verify_email', async(req, res)=>{
    const authRouterUrl = req.protocol+'://'+req.hostname+'/api/auth'
    const {email} = req.body.user

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
          ${authRouterUrl}/auth_token/${token}`
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

module.exports = router