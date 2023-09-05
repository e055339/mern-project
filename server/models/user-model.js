const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 20,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
