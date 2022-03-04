
const { secretToken } = require("./constant.js");
const Client = require('../models/client');
const jwt = require("jsonwebtoken");
const path = require('path');
const multer = require('multer');
const fs = require('fs');
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
 * isEmployeeAuth - This function checks whether the user is employee or admin.
 *
 * @return {function} Middleware
 */
function isAuth(req, res, next) {
  if (req.user.role === 'Employee' || req.user.role === 'Admin') {
    next();
  }
  else {
    return responseFormatter(res, {message : `${req.user.role}s are not allowed.`}, null);
  }
}


/**
 * isAdminAuth - This function checks whether the user is admin or not.
 *
 * @return {function} Middleware
 */
 function isAdminAuth(req, res, next) {
   if (req.user.role === 'Admin') {
     next();
   }
   else {
     return responseFormatter(res, {message : `${req.user.role}s are not allowed.`}, null);
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
  if (findClient.length == 0) {
    return 1;
  } else {
    const uniqueId = findClient[findClient.length-1].uniqueId + 1;
    return uniqueId;
  }
}


const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  },
})
var upload = multer({
  storage: fileStorageEngine,
  fileFilter: function(req, file, callback) {
    const ext = path.extname(file.originalname)
    const allowed = ['.png', '.jpg', '.jpeg', '.pdf', '.PNG', '.JPEG', '.JPG'];
    if (allowed.includes(ext)){
      callback(null,true);
    } else {
      return callback("Only jpg, png and pdf file supported!");
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2
  }
});


/**
 * responseFormatter - Function for handling api responses.
 *
 * @param {object} res   Response given by api.
 * @param {Obejct} error  Error message.
 * @param {Object} data  Data send as a response.
 *
 */
const responseFormatter = (res, error, data) => {
  if (error) {
    res.status(400);
    res.send(error);
  } else {
    Promise.resolve(data).then((value) => {
      if (!value) {
        res.status(204);
        res.send({ data: null });
      } else {
        const response = data;
        res.status(200);
        res.send(response);
      }
    });
  }
};


module.exports = {
   authenticateToken,
   isSameUser,
   giveUniqueId,
   upload,
   responseFormatter,
   isAdminAuth,
   isAuth
 };
