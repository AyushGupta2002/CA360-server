
const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const { authenticateToken, responseFormatter, isAdminAuth } = require("../config/util");

                                                         /**
                                                          * This route will give all roles.
                                                          */
router.get("/", authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const rolesData = await Role.find();
    responseFormatter(res, null, {data : rolesData});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});


                                                                /**
                                                                 * This route will give the deatils of particular role.
                                                                 */
router.get("/:roleId", authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const roleData = await Role.findOne({_id : req.params.roleId});
    responseFormatter(res, null, {data : roleData});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
})

                                                       /**
                                                        * This route will add new role.
                                                        */
router.post("/", authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const roleData = await Role.findOne({role : req.body.role});
    if (roleData) {
      responseFormatter(res, {message : "Role already exists!"}, null);
    } else{
      const createRole = new Role(req.body);
      const newRole = await createRole.save();
      responseFormatter(res, null, {data : newRole});
    }
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});



                                                       /**
                                                        * This route will update the user role.
                                                        */
router.put("/:roleId", authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const updatedClientTask = await Role.findOneAndUpdate(
      {_id : req.params.roleId},
      req.body,
      {new : true}
    );
    responseFormatter(res, null, {message : "Role updated Successfully."});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});


                                                            /**
                                                            * This route will delete a role.
                                                            */
router.delete("/:roleId", authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const removeRole = await Role.deleteMany({_id : req.params.roleId});
    responseFormatter(res, null, {message : "Role removed successfully."});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});


module.exports = router;
