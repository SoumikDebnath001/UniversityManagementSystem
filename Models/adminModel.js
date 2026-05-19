const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name:      { type: String },
  email:     { type: String },
  password:  { type: String },
  token:     { type: String },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Admin", adminSchema);