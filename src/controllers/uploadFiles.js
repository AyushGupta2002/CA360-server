
const express = require('express');
const router = express.Router();
const fs = require('fs');
const Task = require('../models/task');
const { authenticateToken, upload, responseFormatter, isAuth } = require('../config/util');

router.put("/:taskId/upload", authenticateToken, isAuth, upload.array("uploadFile"), async(req, res) => {
  try {
    const taskData = await Task.findOne({_id : req.params.taskId});
    req.files.forEach((file) => {
        taskData.uploadFile.push("/uploads/"+file.filename);
      });
      const updateTask = await taskData.save();
      responseFormatter(res, null, {message : "File uploaded successfully."});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});


router.delete("/:taskId/remove", authenticateToken, isAuth, async(req, res) => {
  try {
    const removeFiles = await Task.findOneAndUpdate(
        {_id : req.params.taskId},
        { $pullAll : {
          uploadFile: req.body.files
        }
      },
        {new : true}
      );
      fs.unlink("public/" + req.body.files[0], (e) => {
          if (e) {
            responseFormatter(res, {message : "File not exist!"}, null);
          } else {
            responseFormatter(res, null, {message : "File removed successfully."});
          }
      });

  } catch (e) {
      responseFormatter(res, {message : e.message}, null);
  }
})





module.exports = router;
