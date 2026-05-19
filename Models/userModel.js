const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    //=====================Basic User Information==========================
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },

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
    //=====================Basic User Information==========================



    //=====================student=========================
    department: { type: String },
    course: { type: String },
    year: { type: Number },
    semester: { type: Number },
    rollNo: { type: String },
    attendancePercentage: { type: Number },
    cgpa: { type: Number },
    roomAllocation: { type: mongoose.Schema.Types.ObjectId },

    // class membership (student)
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null,
    },
    isClassMonitor: { type: Boolean, default: false },
    //=====================student=========================


    //=====================faculty / staff=========================
    employeeId: { type: String },
    designation: { type: String },
    qualification: { type: String },
    experienceYears: { type: Number },
    salary: { type: Number },
    //=====================faculty / staff=========================

    //=====================placement=========================
    companyName: { type: String },
    package: { type: Number },
    //=====================placement=========================


    //=====================parent=========================
    studentId: { type: String },
    relation: { type: String },
    //=====================parent=========================

    //=====================admission agent =========================
    agentId: { type: String },
    region: { type: String },
    commission: { type: Number },
    //=====================admission agent =========================

    //=====================audit=========================
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByRole: { type: String },
    //=====================audit=========================
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);