
const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
  approvalRequest : {
    type : String,
    required : true
  },
  requestingUser : {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true
  },
  requestingForClient : {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "client"
  },
  requestingForUser : {
    type : mongoose.SchemaTypes.ObjectId,
    ref: "user"
  },
  newData : {
    type : Object,
    required : true
  }
});

const Approval = mongoose.model("aprroval", approvalSchema);
module.exports = Approval;
