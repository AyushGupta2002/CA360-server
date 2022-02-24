
const { secretToken } = require("../../constant.js");
const Client = require('../models/client');
const jwt = require("jsonwebtoken");
const path = require('path');
const multer = require('multer');

/**
 * authenticateToken - This function will authorize the token.
 *
 * @param {Object} req  contains user information.
 * @param {Object} res  Status if token is not valid.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.json({error: "UnAuthorized"});

  jwt.verify(token, secretToken, (err, user) => {
    if (err) return res.json({error : "UnAuthorized"});
    req.user = user;
    next();
  });
}

/**
 * userRole - This function checks the role of the user.
 *
 * @param {String} role This is the required role.
 *
 * @return {function} Middleware
 */
function userRole(role) {
  return (req, res, next) => {
    if (req.user.role === role || req.user.role === 'Admin') {
      next();
    }
    else {
      return res.send({"status" : `${req.user.role}'s are not allowed.`});
    }
  }
}


/**
 * isSameUser - Checks whether the user wants to access is same as desired user.
 *
 * @param {Object} req  user information.
 *
 * @return {function} a Middleware function.
 */
function isSameUser(req, res, next) {
  if (req.params.userId === req.user._id || req.user.role === 'Admin') {
    next();
  } else {
    return res.send({"status" : "You are not allowed."})
  }
}


/**
 * giveUniqueId - gives unique client id for each client.
 *
 * @param {array} findClient list of all client
 *
 * @return {Number} unique id for clients.=
 */
function giveUniqueId(findClient) {
  if (!findClient) {
    return 1;
  } else {
    const uniqueId = findClient[findClient.length-1].uniqueId + 1;
    return uniqueId;
  }
}

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    let ext = path.extname(file.originalname)
    cb(null, Date.now() + ext)
  }
})

var upload = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype ==  "image/jpg"
    ){
      callback(null,true);
    } else {
      console.log("Only jpg and png file supported!");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2
  }
})




module.exports = { authenticateToken, userRole, isSameUser, giveUniqueId, upload };
