
const express = require('express');
const router = express.Router();
const fs = require('fs');
const Task = require('../models/task');
const { authenticateToken, userRole, upload } = require('../config/util');

router.put("/:taskId/upload", authenticateToken, userRole("Employee"), upload.array("uploadFile"), async(req, res) => {
  try {
    const findTask = await Task.findOne({_id : req.params.taskId});
    if (!findTask) {
      res.json({"status" : "Task not found!"});
    } else {
      req.files.forEach((file) => {
        findTask.uploadFile.push(file.path);
      });
      const updateTask = await findTask.save();
      res.json({"status" : "Files uploaded successfully."});
    }
  } catch (e) {
    res.json(e.message);
  }
});


router.delete("/:taskId/remove", authenticateToken, userRole("Employee"), async(req, res) => {
  try {
    const findTask = await Task.findOne({_id : req.params.taskId});
    if (!findTask) {
      res.json({"status" : "Task not found!"});
    } else {

      const removeFiles = await Task.findOneAndUpdate(
        {_id : req.params.taskId},
        { $pullAll : {
          uploadFile: req.body.files
        }
      },
        {new : true}
      );
      req.body.files.forEach((file) => {
        fs.unlink(file, (e) => {
          if (e) {
            console.log(e);
            return;
          }
        });
      });
      res.json({"status" : "File deleted successfully."});
    }
  } catch (e) {
    res.json(e.message);
  }
})





module.exports = router;
