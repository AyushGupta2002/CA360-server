
const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
  approvalRequest : {
    type : String,
    required : true
  },
  requestingUser : {
    type : Object
  },
  requestingForClient : {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "client"
  },
  requestingForUser : {
    type : mongoose.SchemaTypes.ObjectId,
    ref: "user"
  },
  status: {
    type : String,
    required : true
  },
  data : {
    type : Object,
    required : true
  }
});

const Approval = mongoose.model("aprroval", approvalSchema);
module.exports = Approval;
