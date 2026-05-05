const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    roomType: {
      type: String,
      enum: ["Shared","Single"],
      required: true,
    },
    RoomCapacity: {
      type: Number, 
      enum: [1, 2, 3],
      required: true,
    },
    currentOccupants: {
      type: Number,
      default: 0,
    },
    facilities: {
      type: [String],
      default: [],
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
