const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: [
        "student",
        "faculty",
        "hod",
        "finance",
        "exam_controller",
        "hr",
        "librarian",
        "warden",
        "transport_manager",
        "placement_officer",
        "parent",
        "admission_agent",
      ],
      required: true,
    },

    token: { type: String, select: false },
    isActive: { type: Boolean, default: true },

    //student
    department:           { type: String },
    course:               { type: String },
    year:                 { type: Number },
    semester:             { type: Number },
    rollNo:               { type: String },
    attendancePercentage: { type: Number },
    cgpa:                 { type: Number },
    roomAllocation:        {type:mongoose.Schema.Types.ObjectId},

    // class membership (student)
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null,
    },
    isClassMonitor: { type: Boolean, default: false },

    //faculty / staff
    employeeId:      { type: String },
    designation:     { type: String },
    qualification:   { type: String },
    experienceYears: { type: Number },
    salary:          { type: Number },

    //placement
    companyName: { type: String },
    package:     { type: Number },

    //parent
    studentId: { type: String },
    relation:  { type: String },

    //admission agent 
    agentId:    { type: String },
    region:     { type: String },
    commission: { type: Number },

    //audit
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByRole: { type: String },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);