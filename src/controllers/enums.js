
const express = require('express');
const router = express.Router();
const { enums } = require('../config/constant.js');
const { authenticateToken, isAuth, responseFormatter } = require("../config/util");

router.get("/", authenticateToken, isAuth, (req, res) => {
  responseFormatter(res, null, {data : enums});
});

module.exports = router;
