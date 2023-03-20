import express from "express";
import { courseValidation } from "../validation.js";
import Course from "../models/courseModel.js";
const router = express.Router();

//查看所有課程
router.get("/", async (req, res) => {
  try {
    let allCourses = await Course.find({}).exec();
    return res.send(allCourses);
  } catch (e) {
    return res.status(500).send(e);
  }
});
//新增課程
router.post("/", async (req, res) => {
  //確認是否符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //確認登入者是否為學生
  if (req.user.isStudent()) {
    return res.status(400).send("只有講師可以新增課程，請切換為講師帳號。");
  }
  //確認為老師即可新增課程
  let { title, description, price } = req.body;
  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });
  try {
    let savedCourse = await newCourse.save();
    return res.send({
      msg: "成功新增課程！",
      savedCourse,
    });
  } catch (e) {
    return res.status(500).send(e);
  }
});
//用講師_id尋找課程
router.get("/instructor/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.find({ instructor: _id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(foundCourse);
  } catch (e) {
    console.log(e);
  }
});
//用學生_id尋找課程
router.get("/student/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.find({ students: _id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(foundCourse);
  } catch (e) {
    console.log(e);
  }
});
//用課程_id尋找課程
router.get("/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let foundCourse = await Course.findOne({ _id })
      .populate("instructor", ["username", "email"])
      .exec();
    if (!foundCourse) {
      return res.status(400).send("此課程不存在，請確認後再輸入。");
    } else {
      return res.send(foundCourse);
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});
//用課程名稱尋找課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["email", "username"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});
//編輯課程
router.patch("/:_id", async (req, res) => {
  //確認是否符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //確認是否有此課程、是否為講師並編輯課程
  try {
    let { _id } = req.params;
    let foundCourse = await Course.findOne({ _id }).exec();
    if (!foundCourse) {
      return res.status(400).send("此課程不存在，請確認後再輸入。");
    }
    if (foundCourse.instructor.equals(req.user._id)) {
      let updateCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      }).exec();
      return res.send({
        msg: "課程更新成功",
        updateCourse,
      });
    } else {
      return res.status(403).send("只有該課程的講師可以編輯課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});
// 讓學生透過課程id來註冊新課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    await Course.findOneAndUpdate(
      { _id },
      { $push: { students: req.user._id } }
    );
    return res.send("註冊完成");
  } catch (e) {
    return res.send(e);
  }
});
//刪除課程
router.delete("/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let foundCourse = await Course.findOne({ _id }).exec();
    if (!foundCourse) {
      return res.status(400).send("此課程不存在，請確認後再輸入。");
    }
    if (foundCourse.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("成功刪除課程");
    } else {
      return res.status(403).send("只有該課程的講師可以刪除課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

export default router;
