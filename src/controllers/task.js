
const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { authenticateToken, upload, responseFormatter, isAuth, isAdminAuth } = require("../config/util");
const fs = require('fs');
                /**
                 * This route will give all the tasks.
                 */
router.get("/", authenticateToken, isAuth, async(req, res) => {
  try {
    const tasksData = await Task.find();
    responseFormatter(res, null, {data : tasksData});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});


                       /**
                        * This route will give a single task details.
                        */
router.get("/:taskId", authenticateToken, isAuth, async(req, res) => {
  try {
    const taskData = await Task.findOne({_id : req.params.taskId});
    responseFormatter(res, null, {data : taskData});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
})


                 /**
                  * This route will create a new task.
                  */
router.post("/", authenticateToken, isAuth, upload.array("uploadFile"), async(req, res) => {
  try {
    const taskData = await Task.findOne({taskName : req.body.taskName});
    if (taskData) {
      responseFormatter(res, {message : "Task name already exists!"}, null);
    } else {
      const createTask = new Task(req.body);
      req.files.forEach((file) => {
        createTask.uploadFile.push(`${file.path}`);
      });
      const newTask = await createTask.save();
      responseFormatter(res, null, {data : newTask});
    }
  } catch (e) {
     responseFormatter(res, {message : e.message}, null);
  }
});


                         /**
                          * This route will update the task.
                          */
router.put("/:taskId", authenticateToken, isAuth, async(req, res) => {
  try {
    const updatedClientTask = await Task.findOneAndUpdate(
      {_id : req.params.taskId},
      req.body,
      {new : true}
    );
    responseFormatter(res, null, {data : updatedTask});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});


                          /**
                           * This route will delete a task.
                           */
router.delete("/:taskId", authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const taskData = await Task.findOne({_id : req.params.taskId});
    const removeTask = await Task.deleteMany({_id : req.params.taskId});
      taskData.uploadFile.forEach((file) => {
        fs.unlink(file, (e) => {
          if (e) {
            responseFormatter(res, {message : e.message}, null);
          }
        });
      });
      responseFormatter(res, null, {message : "Task removed successfully."});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
})



module.exports = router;
