const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", default: null },
    type:      { type: String, enum: ["class", "lunch", "break"], default: "class" },
    room:      { type: String },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    course:     { type: String, required: true },
    department: { type: String, required: true },
    semester:   { type: Number, required: true },
    day: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    slots:     [slotSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
