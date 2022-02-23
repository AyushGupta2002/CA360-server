
const express = require('express');
const router = express.Router();
const { enums } = require('../../constant.js');
const { authenticateToken, userRole } = require("../config/util");

router.get("/", authenticateToken, userRole("Employee"), (req, res) => {
  res.json(enums);
});

module.exports = router;
