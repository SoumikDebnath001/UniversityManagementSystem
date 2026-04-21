const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  token:String,
  
  isDeleted:{
    default:false,
    type:Boolean
  }
});

module.exports = mongoose.model('Admin', adminSchema);