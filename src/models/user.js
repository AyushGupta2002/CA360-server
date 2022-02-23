const mongoose = require('mongoose');
const { enums } = require('../../constant.js');

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
  }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
