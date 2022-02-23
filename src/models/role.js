
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role : {
    type : String
  }
});

const Role = mongoose.model("role", roleSchema);
module.exports = Role;
