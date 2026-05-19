const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
    },

    subjectCode: {
      type: String,
    },
  },
  { _id: true }
);

const semesterSchema = new mongoose.Schema(
  {
    semester: {
      type: Number,
    },

    subjects: [subjectSchema],
  },
  { _id: true }
);

const subjectSchema = new mongoose.Schema(
  {
    courseId:{type:mongoose.Schema.Types.ObjectId},
    departmentId:{type:mongoose.Schema.Types.ObjectId},
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    subjectName: { type: String, required: true, trim: true },
    course:      { type: String, required: true },
    semesters:[semesterSchema],
    isDeleted:   { type: Boolean, default: false },
    isActive:{type:Boolean , default:false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);



