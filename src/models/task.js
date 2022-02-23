
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

  taskName : {
    type : String,
    required : true
  },
  assignedTo: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true
  },
  description : {
    type : String
  },
  status : {
    type : String,
    default : "open"
  }
});

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
