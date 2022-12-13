const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT || 4050;

//IMPORT ROUTES

const authRoute = require("./routes/auth/auth");
const projectRoute = require("./routes/project/project");
const resourceRoute = require("./routes/resource/resource");
const userRoute = require("./routes/user/user");
const service = require("./routes/service/verify")

//IMPORT MIDDLEWARE
const authenticate = require('./middleware/authenticate')


//CONNECTION TO DATABASE

mongoose.connect(
  process.env.DB_CONNECT,
  //   { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true },
  () => console.log("connected to db")
);
//MIDDLEWARE

app.use(express.json(), cors());

//ROUTE MIDDLEWARE

app.use("/api/auth", authRoute);
app.use("/api/project", projectRoute);
app.use("/api/resource", resourceRoute);
app.use("/api/user", userRoute);
app.use("/api/service", authenticate, service)

app.get("/", (req, res) => {
  res.send(`<h3>Hey! Mock API Backend is up !</h3>`);
});

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));
