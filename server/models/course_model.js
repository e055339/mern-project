const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  id: { type: String },
  title: { type: String, require: true },
  description: { type: String, require: true },
  price: {
    type: Number,
    require: true,
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  students: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Course", courseSchema);
