
const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const { authenticateToken, userRole } = require("../config/util");

                                                         /**
                                                          * This route will give all roles.
                                                          */
router.get("/", authenticateToken, userRole("Employee"), async(req, res) => {
  try {
    const foundRoles = await Role.find();
    if (!foundRoles) {
      res.json({"status" : "Roles not found!"});
    } else {
      res.json(foundRoles);
    }
  } catch (e) {
    res.json(e.message);
  }
});


                                                       /**
                                                        * This route will add new role.
                                                        */
router.post("/", authenticateToken, userRole("Admin"), async(req, res) => {
  try {
    const foundRole = await Role.findOne({role : req.body.role});
    if (foundRole) {
      res.json({"status" : "Role is already present."})
    } else{
      const createRole = new Role(req.body);
      const newRole = await createRole.save();
      res.json(newRole);
    }
  } catch (e) {
    res.jon(e.message);
  }
});

                                                            /**
                                                            * This route will delete a role.
                                                            */
router.delete("/:roleId", authenticateToken, userRole("Admin"), async(req, res) => {
  try {
    const removeRole = await Role.deleteMany({_id : req.params.roleId});
    res.json("Role removed successfully.")
  } catch (e) {
    res.json(e.message);
  }
});


module.exports = router;
