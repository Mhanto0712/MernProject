import express from "express";
import { registerValidation } from "../validation.js";
import { loginValidation } from "../validation.js";
import User from "../models/userModel.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", async (req, res) => {
  //確認是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //確認email是否已被註冊過
  let checkEmail = await User.findOne({ email: req.body.email });
  if (checkEmail) return res.status(400).send("此email已被使用，請換一個。");
  //將新用戶資料存入數據庫
  let { username, email, password, role } = req.body;
  let newUser = new User({
    username,
    email,
    password,
    role,
  });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "成功儲存！",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者......");
  }
});

router.post("/login", async (req, res) => {
  //確認是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //確認是否有此email
  let checkEmail = await User.findOne({ email: req.body.email });
  if (!checkEmail)
    return res.status(401).send("無法找到使用者。請確認信箱是否正確。");
  //確認密碼是否正確
  checkEmail.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    if (isMatch) {
      const tokenObj = { _id: checkEmail._id, email: checkEmail.email };
      const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "成功登入！",
        token: "JWT " + token,
        user: checkEmail,
      });
    } else {
      return res.status(401).send("密碼錯誤，請再輸入一次。");
    }
  });
});

export default router;
