const jwt = require("jsonwebtoken");

/**
 * @description
 * Act as a middleware that provide a user
 * authentication for performing various
 * sensitive activity
 */
const userAuth =  (req, res, next) => {
  const token = req.headers["auth-token"];

  if (!token) {
    return res.status(401).send({
      status: "401",
      message: "Token is needed",
    });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(400).send({
        status: "400",
        message: "Something wrong",
      });
    }
    //SET USER INFO
    req.body.user = payload;
    return next();
  });
  
};

module.exports = userAuth;
