
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Approval = require("../models/approval");
const { authenticateToken, giveUniqueId, isSameUser, responseFormatter, isAuth, isAdminAuth } = require("../config/util");

                /**
                 * This route will give information of all the users.
                 */
router.get("/", authenticateToken, isAuth, async(req, res) => {
  try{
    const usersData = await User.find({}, ['_id', 'username', 'name', 'role', 'uniqueId']);
    responseFormatter(res, null, {data : usersData});
  }
  catch(e) {
    responseFormatter(res, {message : e.message}, null);
  }
});

                      /**
                       * This route will give the information of a particular user.
                       */
router.get("/:userId", authenticateToken, isAuth, async(req, res) => {
  try {
    const userData = await User.findOne({_id : req.params.userId},['_id','name','username','role']);
    responseFormatter(res, null, {data : userData});
  } catch(e) {
    responseFormatter(res, {message : e.message}, null);
  }
})

                /**
                 * This route will create new users(employee).
                 */
router.post("/",authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const { name, username, password } = req.body

    if ( !name || !password || !username) {
      responseFormatter(res, {message : "Please fill all the required fields!"}, null);
    }
    else {
      const userData = await User.findOne({username : req.body.username})
      if (userData) {
        responseFormatter(res, {message : "User name already exists!"}, null);
      } else {
        const userData = await User.find({});
        const uniqueId = giveUniqueId(userData);
        const createUser = new User(req.body);
        if (createUser){
          createUser.uniqueId = uniqueId;
          const newUser = await createUser.save()
          responseFormatter(res, null, {data : newUser});
        }
      }
    }
  }
   catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
})

                         /**
                          * This route will update the user details.
                          */
router.put("/:userId", authenticateToken, isSameUser, async(req, res) => {
    try{
      const updatedUser = await User.findOneAndUpdate(
        {_id : req.params.userId},
         req.body, {new : true}
      )
      responseFormatter(res, null, {message : "User updated Successfully."});
    } catch (e) {
      responseFormatter(res, {message : e.message}, null);
    }
})

                          /**
                           * This route will delete the user.
                           */
router.delete("/:userId", authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const deletedUser = await User.deleteMany({_id : req.params.userId})
    responseFormatter(res, null, {message : "User removed successfully."});
  } catch(e) {
    responseFormatter(res, {message : e.message}, null);
  }
})


module.exports = router;
