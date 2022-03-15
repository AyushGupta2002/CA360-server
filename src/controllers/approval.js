
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Approval = require('../models/approval');
const Client = require('../models/client');
const User = require('../models/user');
const { authenticateToken, isAdminAuth, responseFormatter, giveUniqueId} = require('../config/util');


                                                /**
                                                 * This route will give the list of all approval requests.
                                                 *
                                                 */
router.get("/", authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const apporvalData = await Approval.find({status : "open"});
    responseFormatter(res, null, {data : apporvalData});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});


                                                           /**
                                                            * This route will give the data of a particular request.
                                                            */
router.get("/:approvalId", authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const apporvalData = await Approval.findOne({_id : req.params.approvalId});
    responseFormatter(res, null, {data : apporvalData});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});

                                                                   /**
                                                                    * this route will update the client's or user's data once approved by Admin.
                                                                    */
router.put("/update/:approvalId",  authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const approvalData = await Approval.findOne({_id : req.params.approvalId});
    if (approvalData.approvalRequest === "updateClient") {
      const updatedClient = await Client.findOneAndUpdate(
        {_id : approvalData.requestingForClient},
        approvalData.data, {new : true}
      )
      approvalData.status = "Approved";
      const approvedRequest = await approvalData.save();
      responseFormatter(res, null, {message : "Client updated Successfully."});
    }
    else {
      const updatedUser = await User.findOneAndUpdate(
        {_id : approvalData.requestingForUser},
        approvalData.data, {new : true}
      )
      const removeRequest = await Approval.deleteMany({_id : req.params.approvalId});
      responseFormatter(res, null, {message : "User updated Successfully."});
    }
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});


                                                                      /**
                                                                       * this route will delete a client once approved by Admin.
                                                                       */
router.delete("/delete/:approvalId",  authenticateToken, isAdminAuth, async(req, res) => {
  try {
    const approvalData = await Approval.findOne({_id : req.params.approvalId});
    if (approvalData.approvalRequest === "deleteClient") {
      const deletedClient = await Client.deleteMany({_id : approvalData.requestingForClient});
      approvalData.status = "Approved";
      const approvedRequest = await approvalData.save();
      responseFormatter(res, null, {message : "Client deleted Successfully."});
    }
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});


                                                              /**
                                                               * This route handles the requests rejected by Admin.
                                                               */
router.delete("/:approvalId", authenticateToken, isAdminAuth, async(req, res)=> {
  try {
    const approvalData = await Approval.findOne({_id : req.params.approvalId});
    approvalData.status = "Rejected";
    const approvedRequest = await approvalData.save();
    responseFormatter(res, null, {message : "Request rejected!"});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
})




module.exports = router;
