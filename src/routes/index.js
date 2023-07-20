const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", async function (req, res, next) {
  res.send("test");
});

module.exports = router;
