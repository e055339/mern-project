const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("正在接收一個course route的請求");
  next();
});

router.get("/", async (req, res) => {
  try {
    let foundCourse = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(foundCourse);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//使用instructor id搜尋講師擁有的課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

//使用學生id搜尋已註冊的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let courseFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(courseFound);
});

//使用課程名稱尋找課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["email", "username"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    res.status(500).send(e);
  }
});

//使用課程id尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.findOne({ _id })
      .populate("instructor", ["email"])
      .exec();
    return res.send(foundCourse);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//只有instructor能發布課程
router.post("/", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有instructor才能發布課程，請改用instructor帳號登入");
  }

  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send("新課程創建成功");
  } catch (e) {
    return res.status(500).send("無法創建課程");
  }
});

//讓學生透過課程id註冊新課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    course.students.push(req.user._id);
    await course.save();
    return res.send("註冊成功");
  } catch (e) {
    return res.send(e);
  }
});

//使用課程id修改課程
router.patch("/:_id", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;

  try {
    let foundCourse = await Course.findOne({ _id });
    if (!foundCourse) {
      return res.status(400).send("找不到此課程");
    }

    if (foundCourse.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findByIdAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({ message: "課程更新成功", updatedCourse });
    } else {
      return res.status(403).send("只有此課程的instructor能夠更新課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;

  try {
    let foundCourse = await Course.findOne({ _id }).exec();
    if (!foundCourse) {
      return res.status(400).send("找不到此課程");
    }

    if (foundCourse.instructor.equals(req.user._id)) {
      let deletedCourse = await Course.deleteOne({ _id }).exec();
      return res.send({ message: "課程刪除成功" });
    } else {
      return res.status(403).send("只有此課程的instructor能夠刪除課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
