const express = require("express");
const router = express.Router();
const Client = require("../models/client");
const Approval = require("../models/approval");
const { authenticateToken, giveUniqueId, responseFormatter, isEmployeeAuth } = require("../config/util");

                /**
                 * This route will give the information of all the clients.
                 */
router.get("/", authenticateToken, isEmployeeAuth, async(req, res) => {
  try {
    const clientsData = await Client.find({},['_id', 'dependent', 'businessName', 'uniqueId', 'contacts.primaryMobile']);
    responseFormatter(res, null, {data : clientsData});
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
});

                         /**
                          * This route will give the information of a particular client.
                          */
router.get("/:clientId", authenticateToken, isEmployeeAuth, async(req, res) => {
  try {
    const clientData = await Client.findOne({_id : req.params.clientId});
    responseFormatter(res, null, {data : clientData});
  } catch(e) {
    responseFormatter(res, {message : e.message}, null);
  }
})

                 /**
                  * This route will create a new client.
                  */
router.post("/", authenticateToken, isEmployeeAuth, async(req, res) => {
  try {

      const clientData = await Client.findOne({businessName : req.body.businessName});
       if (clientData) {
         responseFormatter(res, {message : "Business name already exists!"}, null);
       } else {
         const newApprovalRequest = new Approval({
           approvalRequest : "createClient",
           requestingUser : req.user._id,
           data : req.body
         });
         const createApprovalRequest = await newApprovalRequest.save();
         responseFormatter(res, null, {message : "Client gets created once admin approves."});
       }

  } catch (e) {
      responseFormatter(res, {message : e.message}, null);
  }
})

                           /**
                            * This route will update the client's details.
                            */
router.put("/:clientId", authenticateToken, isEmployeeAuth, async(req, res) => {
  try {
    const clientData = await Client.findOne({businessName : req. body.businessName});
    if (clientData) {
      responseFormatter(res, {message : "Business name already exists!"}, null);
    } else {
      const newApprovalRequest = new Approval({
        approvalRequest : "updateClient",
        requestingUser : req.user._id,
        requestingForClient : req.params.clientId,
        data : req.body
      });
      const createApprovalRequest = await newApprovalRequest.save();
      responseFormatter(res, null, {message : "Client get updated once Admin will approve."});
    }
  } catch (e) {
    responseFormatter(res, {message : e.message}, null);
  }
})

                            /**
                             * This route will delete a client.
                             */
router.delete("/:clientId", authenticateToken, isEmployeeAuth, async(req, res) => {
  try {
    const clientData = await Client.findOne({_id : req.params.clientId});
    const newApprovalRequest = new Approval({
      approvalRequest : "deleteClient",
      requestingUser : req.user._id,
      requestingForClient : req.params.clientId,
      data : clientData
    });
    const createApprovalRequest = await newApprovalRequest.save();
    responseFormatter(res, null, {message : "Client get removed once admin approves."});
  } catch(e) {
    responseFormatter(res, {message : e.message}, null);
  }
})





module.exports = router
