const express = require("express");

const databaseController = require("../controllers/database.controller");
const documentController = require("../controllers/document.controller");

const router = express.Router();

router.get("/:userid/databases", databaseController.getAllDatabases);
router.post("/:userid/databases", databaseController.createDatabase);

router.get("/:userid/databases/:databaseid", databaseController.getDatabase);
router.put("/:userid/databases/:databaseid", databaseController.deleteDatabase);

router.get(
  "/:userid/databases/:databaseid/documents",
  documentController.getAllDocuments,
);

module.exports = router;
