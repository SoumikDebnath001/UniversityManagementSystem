

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    eligibility: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    departments: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseDepartment", courseSchema);

























// const classSchema = new mongoose.Schema(
//   {
//     className: { type: String, required: true },

//     // Short unique code students use to join  e.g. "CS-2024-A"
//     classCode: { type: String, required: true, unique: true, uppercase: true, trim: true },

//     department: { type: String },
//     course:     { type: String },
//     year:       { type: Number },
//     semester:   { type: Number },

//     // The admin who created this class
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//       required: true,
//     },

//     // One student elected as class monitor by HOD
//     classMonitor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     // All enrolled students
//     students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Class", classSchema);