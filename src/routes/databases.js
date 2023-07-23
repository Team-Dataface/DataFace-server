const express = require("express");

const databaseController = require("../controllers/database.controller");

const router = express.Router();

router.get("/", databaseController.getAllDatabases);

router.get("/:databaseid", databaseController.getDatabase);
router.put("/:databaseid", databaseController.deleteDatabase);

module.exports = router;
