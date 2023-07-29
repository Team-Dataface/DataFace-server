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
  const fields = req.body;

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

    res.status(201).json({ success: true, newDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create document" });
  }
};

exports.editDocuments = async function (req, res, next) {
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

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to edit documents" });
  }
};

exports.getDocument = async function (req, res, next) {
  const userId = req.params.userid;
  const databaseId = req.params.databaseid;
  const documentId = req.params.documentid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const database = user.databases.id(databaseId);

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    const document = database.documents.id(documentId);

    if (!document) {
      return res.status(404).json({ error: "Document Not Found" });
    }

    res.status(200).json({ document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get document" });
  }
};

exports.editDocument = async function (req, res, next) {
  const userId = req.params.userid;
  const databaseId = req.params.databaseid;
  const documentId = req.params.documentid;
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

    const document = database.documents.id(documentId);

    if (!document) {
      return res.status(404).json({ error: "Document Not Found" });
    }

    fields.forEach(
      ({ fieldId, fieldValue, fieldName, xCoordinate, yCoordinate }) => {
        const field = document.fields.id(fieldId);

        if (!field) {
          return res.status(404).json({ error: "Field Not Found" });
        }

        field.fieldValue = fieldValue;
        database.documents.forEach((doc) => {
          const targetField = doc.fields.find(
            (fld) => fld.fieldName === fieldName,
          );

          targetField.xCoordinate = xCoordinate;
          targetField.yCoordinate = yCoordinate;
        });
      },
    );

    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to edit document" });
  }
};

exports.deleteDocument = async function (req, res, next) {
  const userId = req.params.userid;
  const databaseId = req.params.databaseid;
  const documentId = req.params.documentid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const database = user.databases.id(databaseId);

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    database.documents.pull(documentId);

    await user.save();

    res.status(200).json("Document deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete document" });
  }
};
