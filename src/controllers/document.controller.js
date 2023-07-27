/* eslint-disable consistent-return */
const User = require("../models/User");

exports.getAllDocuments = async function (req, res, next) {
  const userId = req.params.userid;
  const databaseId = req.params.databaseid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const database = user.databases.id(databaseId);

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    const { documents } = database;

    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get databases" });
  }
};

exports.createDocument = async function (req, res, next) {
  const userId = req.params.userid;
  const databaseId = req.params.databaseid;
  const { fields } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const database = user.databases.id(databaseId);

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    const fieldsArray = fields.map(({ fieldName, fieldType, fieldValue }) => ({
      fieldName,
      fieldType,
      fieldValue,
    }));

    const newDocument = await database.documents.create({
      fields: fieldsArray,
    });

    database.documents.push(newDocument);

    await user.save();

    res.status(201).json({ newDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create document" });
  }
};

exports.editDocument = async function (req, res, next) {
  const userId = req.params.userid;
  const databaseId = req.params.databaseid;
  const updates = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const database = user.databases.id(databaseId);

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    updates.forEach(({ documentId, fields }) => {
      const document = database.documents.id(documentId);

      if (!document) {
        return res.status(404).json({ error: "Document Not Found" });
      }

      fields.forEach(({ fieldId, fieldValue }) => {
        const field = document.fields.id(fieldId);

        if (!field) {
          return res.status(404).json({ error: "Field Not Found" });
        }

        field.fieldValue = fieldValue;
      });
    });

    await user.save();

    res.status(200).json({ database });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to edit document" });
  }
};
