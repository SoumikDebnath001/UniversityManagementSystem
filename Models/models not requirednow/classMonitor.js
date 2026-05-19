const mongoose = require("mongoose");

const classMonitor = new mongoose.Schema(
        {
          className:String,
          SectionName:String,
        classid:mongoose.Schema.Types.ObjectId,
        Monitor:mongoose.Schema.Types.ObjectId,
        Sectionid:mongoose.Schema.Types.ObjectId,
        isActive: { type: Boolean },
    },
  { timestamps: true }
);

module.exports = mongoose.model("ClassMonitor", classMonitor);