const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    VisitedByuserId: { type: mongoose.Schema.Types.ObjectId },
    profileOwenerId: { type: mongoose.Schema.Types.ObjectId },
  },
    
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);