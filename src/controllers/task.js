
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
    let responseTaskData = [];
    tasksData.forEach(task => {
      responseTaskData.push({
        _id : task._id,
        taskName : task.taskName,
        assignedTo : task.assignedTo,
        status : task.status,
        createdDate : task.createdDate
      });
    });
    responseFormatter(res, null, {data : responseTaskData});
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
    let responseTaskData = {
        _id : taskData._id,
        taskName : taskData.taskName,
        assignedTo : taskData.assignedTo,
        status : taskData.status,
        createdDate : taskData.createdDate
    }
    responseFormatter(res, null, {data : responseTaskData});
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
      const d = new Date();
      const newTaskObject = {
        assignedTo : req.body.assignedTo,
        taskName : req.body.taskName,
        createdDate : d
      }
      const createTask = new Task(newTaskObject);
      req.files.forEach((file) => {
        createTask.uploadFile.push("/uploads/"+file.filename);
      });
      const newTask = await createTask.save();
      responseFormatter(res, null, {message : "New task created."});
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
    responseFormatter(res, null, {message : "Task updated Successfully."});
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
    var check = true;
      taskData.uploadFile.forEach((file) => {
        fs.unlink("public/" + file, (e) => {
          if (e) {
            check = false;
          }
        });
      });
      if (!check) {
        responseFormatter(res, {message: "File not found!"}, null);
      } else {
        responseFormatter(res, null, {message : "Task removed successfully."});
      }
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
})



module.exports = router;
