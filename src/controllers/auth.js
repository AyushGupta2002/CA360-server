
const {secretToken} = require('../../constant.js');
const express = require('express');
const router = express.Router();
const Client = require('../models/client');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post("/login", async(req, res) => {
   try {
     const findUser = await User.findOne({username : req.body.username})
       if (findUser) {
         if (findUser.password === req.body.password) {

           const user = {
            _id : findUser._id,
            name : findUser.name,
            username : findUser.username,
            role : findUser.role
          };
           const accessToken = jwt.sign(user, secretToken);
           res.json({accessToken: accessToken, name : findUser.name, role : findUser.role, username : findUser.username});

         } else {
           res.json({"status" : "Incorrect password!"})
         }
       } else {
         res.json({"status" : "You are not registered!"})
       }
   } catch (e) {
     res.json({'status' : "Cannot log in."})
   }
})

module.exports = router;
