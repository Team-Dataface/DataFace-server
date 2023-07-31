/* eslint-disable consistent-return */
const User = require("../models/User");

exports.createRelationship = async function (req, res, next) {
  const userId = req.params.userid;
  const databaseId = req.params.databaseid;
  const relationship = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const database = user.databases.id(databaseId);

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    const newRelationship = await database.relationships.create(relationship);

    database.relationships.push(newRelationship);

    await user.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create database relationship" });
  }
};

exports.getRelatedFields = async function (req, res, next) {
  const userId = req.params.userid;
  const databaseId = req.params.databaseid;
  const relationshipId = req.params.relationshipid;
  const { primaryFieldValue } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const database = user.databases.id(databaseId);

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    const relationship = database.relationships.id(relationshipId);

    if (!relationship) {
      return res.status(404).json({ error: "Relationship Not Found" });
    }

    const { foreignDbId, foreignFieldName, foreignFieldsToDisplay } =
      relationship;

    const foreignDatabase = user.databases.id(foreignDbId);

    const relatedDocuments = foreignDatabase.documents.filter((document) => {
      const relatedFields = document.fields.filter(
        (field) =>
          field.fieldName === foreignFieldName &&
          field.fieldValue === primaryFieldValue,
      );

      return !!relatedFields.length;
    });

    const displayedDocuments = relatedDocuments.map((document) => {
      const displayedFields = document.fields.filter((field) =>
        foreignFieldsToDisplay.includes(field.fieldName),
      );
      return { fields: displayedFields };
    });

    res.json({ displayedDocuments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get related fields" });
  }
};
