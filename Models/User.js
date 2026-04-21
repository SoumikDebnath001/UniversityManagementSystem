const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:String,
  email:{
    type:String,
    // unique:true
  },
  password:String,
  role: {
    type: String,
    enum: [
      "student",
      "faculty",
      "hod",
      // "finance",
      // "exam_controller",
      // "hr",
      // "librarian",
      // "warden",
      // "transport_manager",
      // "placement_officer",
      // "parent",
      // "admission_agent"
    ]
  },
  token: String,
  ///////////seperator
  age:String,
  education:String,
  dept:String,
  ///////////////////////
  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);