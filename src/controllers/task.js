
const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { authenticateToken, userRole, upload } = require("../config/util");

                /**
                 * This route will give all the tasks.
                 */
router.get("/", authenticateToken, userRole("Employee"), async(req, res) => {
  try {
    const foundTasks = await Task.find();
    if (!foundTasks) {
      res.json({"status" : "Tasks not found!"});
    } else {
      res.json(foundTasks);
    }
  } catch (e) {
    res.json(e.message);
  }
});


                       /**
                        * This route will give a single task details.
                        */
router.get("/:taskId", authenticateToken, userRole("Employee"), async(req, res) => {
  try {
    const foundTask = await Task.findOne({_id : req.params.taskId});
    if (!foundTask) {
      res.json({"status" : "Task not found!"});
    } else {
      res.json(foundTask);
    }
  } catch (e) {
    res.json(e.message);
  }
})


                 /**
                  * This route will create a new task.
                  */
router.post("/", authenticateToken, userRole("Admin"), upload.single('uploadFile'), async(req, res) => {
  try {
    console.log(req.file);
    const foundTask = await Task.findOne({taskName : req.body.taskName});
    if (foundTask) {
      res.json({"status" : "Task name already exists."});
    } else {
      const createTask = new Task(req.body);
      if (req.file) {
        createTask.uploadFile = req.file.path;
      }

      const newTask = await createTask.save();
      res.json(newTask);
    }
  } catch (e) {
     res.json(e.message);
  }
});


                         /**
                          * This route will update the task.
                          */
router.put("/:taskId", authenticateToken, userRole("Employee"), async(req, res) => {
  try {
    const findTask = await Task.findOne({taskName : req.body.taskName});
    if (findTask) {
      res.json({"status" : "Task name already exists."});
    } else {
      const updateTask = await Task.findOneAndUpdate(
        {_id : req.params.taskId},
        req.body,
        {new : true}
      );
      res.json("Task updated successfully.")
    }
  } catch (e) {
    res.json(e.message);
  }
});


                          /**
                           * This route will delete a task.
                           */
router.delete("/:taskId", authenticateToken, userRole("Admin"), async(req, res) => {
  try {
    const removeTask = await Task.deleteMany({_id : req.params.taskId});
    res.json("Task removed successfully.")
  } catch (e) {
    res.json(e.message);
  }
})



module.exports = router;
