const jwt = require('jsonwebtoken')

/**
 * @description
 * Act as a middleware that provide a user
 * authentication for performing various
 * sensitive activity
 */
const userAuth = async(req,res,next)=>{
    const token = req.body.token

    if(!token){
        return res.status(401).send({ status: "401", message: 'Token is needed' })
    }
    var payload = await new Promise(async(resolve, reject)=>{
        try {
            let _payload = jwt.verify(token,
                process.env.TOKEN_SECRET)
            resolve(_payload)

        } catch (error) {
            console.log(error)
            return res.send({ status: "400", message: 'Something wrong' })
        }
    })

    //SET USER INFO
    req.body.user = payload
    return next()

}

module.exports = userAuth