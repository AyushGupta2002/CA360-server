const express = require("express");
const router = express.Router();
const Client = require("../models/client");
const { authenticateToken, userRole, giveUniqueId } = require("../config/util");

                /**
                 * This route will give the information of all the clients.
                 */
router.get("/", authenticateToken, userRole("Employee"), async(req, res) => {
  try {
    const foundClients = await Client.find({},['_id', 'dependent', 'businessName', 'uniqueId', 'contacts.primaryMobile']);
    if (!foundClients) {
      res.json({"status" : "Clients not found!"})
    } else {
      res.json(foundClients);
    }
  } catch (e) {
    res.json(e.message);
  }
});

                         /**
                          * This route will give the information of a particular client.
                          */
router.get("/:clientId", authenticateToken, userRole("Employee"), async(req, res) => {
  try {
    const foundClient = await Client.findOne({_id : req.params.clientId});

    if (!foundClient) {
      res.json({"status" : "Client not found!"});
    } else {
      res.json(foundClient);
    }
  } catch(e) {
    res.json(e.message);
  }
})

                 /**
                  * This route will create a new client.
                  */
router.post("/", authenticateToken, userRole("Employee"), async(req, res) => {
  try {

      const foundClient = await Client.findOne({businessName : req.body.businessName});
       if (foundClient) {
         res.json({"status" : "Business Name already exists!"})
       } else {
         const findClient = await Client.find({});
         const uniqueId = giveUniqueId(findClient);
         const createClient = new Client(req.body);
         createClient.uniqueId = uniqueId;
         const newClient = await createClient.save();
         res.json(newClient);
       }

  } catch (e) {
    res.json(e.message);
  }
})

                           /**
                            * This route will update the client's details.
                            */
router.put("/:clientId", authenticateToken, userRole("Employee"), async(req, res) => {
  try {
    const findClient = await Client.findOne({businessName : req. body.businessName});
    if (findClient) {
      res.json({"status" : "Business Name already exists!"});
    } else {
      const updateClient = await Client.findOneAndUpdate(
        {_id : req.params.clientId},
        req.body, {new : true}
      )
      res.json("Updated successfully!");
    }
  } catch (e) {
    res.json(e.message);
  }
})

                            /**
                             * This route will delete a client.
                             */
router.delete("/:clientId", authenticateToken, userRole("Admin"), async(req, res) => {
  try {
    const deleteClient = await Client.deleteMany({_id : req.params.clientId})
    res.json("Client successfully removed!")
  } catch(e) {
    res.json(e.message);
  }
})





module.exports = router
