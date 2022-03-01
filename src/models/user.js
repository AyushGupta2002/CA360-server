const mongoose = require('mongoose');
const { enums } = require('../config/constant.js');

const userSchema = new mongoose.Schema({
  name : {
    type: String,
    required : true
  },
  username : {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role : {
    type : String,
    enum : enums.role,
    default : 'Employee'
  },
  uniqueId : {
    type: Number
  }
});

userSchema.path('username').validate(function (username) {
  return String(username)
   .toLowerCase()
   .match(
     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
   );
}, 'Please enter correct email!')

const User = mongoose.model("user", userSchema);
module.exports = User;
