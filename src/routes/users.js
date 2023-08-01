const express = require("express");

const databaseController = require("../controllers/database.controller");
const documentController = require("../controllers/document.controller");
const relationshipController = require("../controllers/relationship.controller");

const router = express.Router();

router.get("/:userid/databases", databaseController.getAllDatabases);
router.post("/:userid/databases", databaseController.createDatabase);

router.get("/:userid/databases/:databaseid", databaseController.getDatabase);
router.delete(
  "/:userid/databases/:databaseid",
  databaseController.deleteDatabase,
);

router.get(
  "/:userid/databases/:databaseid/documents",
  documentController.getAllDocuments,
);
router.post(
  "/:userid/databases/:databaseid/documents",
  documentController.createDocument,
);
router.put(
  "/:userid/databases/:databaseid/documents",
  documentController.editDocuments,
);

router.get(
  "/:userid/databases/:databaseid/documents/:documentid",
  documentController.getDocument,
);
router.put(
  "/:userid/databases/:databaseid/documents/:documentid",
  documentController.editDocument,
);
router.delete(
  "/:userid/databases/:databaseid/documents/:documentid",
  documentController.deleteDocument,
);

router.get(
  "/:userid/databases/:databaseid/relationships",
  relationshipController.getAllRelationships,
);
router.post(
  "/:userid/databases/:databaseid/relationships",
  relationshipController.createRelationship,
);
router.put(
  "/:userid/databases/:databaseid/relationships",
  relationshipController.editRelationship,
);

router.get(
  "/:userid/databases/:databaseid/relationships/:relationshipid",
  relationshipController.getRelatedFields,
);
router.delete(
  "/:userid/databases/:databaseid/relationships/:relationshipid",
  relationshipController.deleteRelationship,
);

module.exports = router;
