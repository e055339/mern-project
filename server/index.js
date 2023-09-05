const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1/mernDB")
  .then(() => {
    console.log("已連結mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//設定route導向
app.use("/api/user", authRoute);
//courseRoute應該jwt被保護
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("後端伺服器正在聆聽port8080");
});
