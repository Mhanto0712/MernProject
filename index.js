import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import courseRoute from "./routes/course.js";
import passport from "passport";
import passportJwt from "./config/passport.js";
import cors from "cors";
passportJwt(passport);
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("已連接至mongoDB中的mernDB");
  })
  .catch((e) => {
    console.log("連接mongoDB失敗");
    console.log(e);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/api/user", authRoute);
app.use(
  //確認只有登入者可以註冊或新增課程
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

//port
app.listen(8080, () => {
  console.log("正在聆聽port 8080......");
});
