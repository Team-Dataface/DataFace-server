const express = require("express");

const databaseController = require("../controllers/database.controller");

const router = express.Router();

router.get("/:userid/databases", databaseController.getAllDatabases);

router.get("/:userid/databases/:databaseid", databaseController.getDatabase);

module.exports = router;
