
const express = require('express');
const router = express.Router();
const { enums } = require('../config/constant.js');
const { authenticateToken, isEmployeeAuth, responseFormatter } = require("../config/util");

router.get("/", authenticateToken, isEmployeeAuth, (req, res) => {
  responseFormatter(res, null, {data : enums});
});

module.exports = router;
