
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authenticateToken, userRole, isSameUser } = require("../config/util");

                /**
                 * This route will give information of all the users.
                 */
router.get("/", authenticateToken, userRole("Employee"), async(req, res) => {
  try{
    const foundUsers = await User.find({}, ['_id', 'username', 'name', 'role']);
    if (!foundUsers) {
      res.json({ "status" : "User not found!" });
    } else {
      res.json(foundUsers);
    }
  }
  catch(e) {
    res.json(e.message);
  }
});

                      /**
                       * This route will give the information of a particular user.
                       */
router.get("/:userId", authenticateToken, userRole("Employee"), async(req, res) => {
  try {
    const foundUser = await User.findOne({_id : req.params.userId},['_id','name','username','role']);

    if (!foundUser) {
      res.json({ "status" : "User not found!" });
    } else {
      res.json(foundUser);
    }
  } catch(e) {
    res.json(e.message);
  }
})

                /**
                 * This route will create new users(employee).
                 */
router.post("/", authenticateToken, userRole("Admin"), async(req, res) => {
  try {
    const { name, username, password } = req.body

    if ( !name || !password || !username) {
      res.json({ "status" : "Please fill all the required fields." })
    }
    else {

      const foundUser = await User.findOne({username : req.body.username})
      if (foundUser) {
        res.json({"status" : "Username already exists."})
      }
      const createUser = new User(req.body)
      const newUser = await createUser.save()
      res.json(newUser);
    }
  }
   catch (e) {
    res.json(e.message);
  }
})

                         /**
                          * This route will update the user details.
                          */
router.put("/:userId", authenticateToken, isSameUser, async(req, res) => {
    try{
      const foundUser = await User.findOne({username : req.body.username})
      if (foundUser) {
        res.json({"status" : "Username already exists."})
      } else {
        const updateUser = await User.findOneAndUpdate({_id: req.params.userId}, req.body,{new:true})
        res.json("Updated successfully!")
      }
    } catch (e) {
      res.json(e.message);
    }
})

                          /**
                           * This route will delete the user.
                           */
router.delete("/:userId", authenticateToken, userRole("Admin"), async(req, res) => {
  try {
    const deleteUser = await User.deleteMany({_id : req.params.userId})
    res.json("User successfully removed!")
  } catch(e) {
    res.json(e.message);
  }
})


module.exports = router;
