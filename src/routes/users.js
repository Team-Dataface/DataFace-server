const express = require("express");

const databaseController = require("../controllers/database.controller");

const router = express.Router();

router.get("/:userid/databases", databaseController.getAllDatabases);

module.exports = router;
