const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("正在接收一個auth的請求");
  next();
});

router.get("/test", (req, res) => {
  return res.send("成功連結auth route");
});

//註冊頁面
router.post("/register", async (req, res) => {
  //確認數據是否符合規範
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //確認信箱是否被註冊過
  let { email, username, password, role } = req.body;
  const emailExist = await User.findOne({ email }).exec();
  if (emailExist) return res.status(400).send("此信箱已被註冊過");

  let newUser = new User({ email, username, password, role });

  try {
    let savedUser = await newUser.save();
    return res.send({ msg: "註冊成功，請重新登入", savedUser });
  } catch (e) {
    return res.status(500).send("儲存時發生錯誤");
  }
});

router.post("/login", async (req, res) => {
  //確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser)
    return res.status(401).send("無法找到使用者，請確認信箱是否正確");

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    if (isMatch) {
      //製作jwt
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(400).send("密碼錯誤");
    }
  });
});

module.exports = router;
