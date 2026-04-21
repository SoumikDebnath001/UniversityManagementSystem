const mongoose = require("mongoose");
const User = require("../User");



const studentSchema = new mongoose.Schema({
  // Basics
  // studentId: String,
  // name: String,
  // email: String,
  // phone: String,
  // gender: String,
  // dateOfBirth: Date,

  // Academic
  department: String,
  course: String,
  year: Number,
  semester: Number,
  rollNo: String,

  // Subjects
  subjects: [{ type: String }],
  courses: [{ type: String }],

  // Fees
  fees: [
    {
      semester: Number,
      year: Number,
      status: String,
      totalAmount: Number,
      amountPaid: Number,
      dueDate: Date,
      paidAt: Date
    }
  ],

  // Attendance
  attendancePercentage: Number,

  // Result
  cgpa: Number,

  isActive: Boolean

}, { timestamps: true });
module.exports = User.discriminator("student", studentSchema);



// {
//     CourseName:string,
//     Subjects:[],
//     startDate:Date,
//     complitionDate:Date,
//     Progress:Number,
//   }