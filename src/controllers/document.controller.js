const { Database } = require("../models/Database");
const { Document } = require("../models/Document");
const { Field } = require("../models/Field");

exports.getAllDocuments = async function (req, res, next) {
  const databaseId = req.params.databaseid;

  try {
    const database = await Database.findById(databaseId)
      .populate("documents")
      .populate("fields");

    const { documents } = database;
    const { fields } = database;

    res.status(200).json({ documents, fields });
  } catch (error) {
    console.error("Error while fetching database", error);
    res.status(500).json({ error: "Failed to Get databases" });
  }
};

exports.createDocument = async function (req, res, next) {
  const databaseId = req.params.databaseid;
  const fields = req.body;
  const documentData = { elements: [] };

  try {
    const database = await Database.findById(databaseId).populate("fields");

    const newFields = await Promise.all(
      fields.map(async (item) => {
        const field = await Field.findById(item.field_id);

        const newField = {
          field: field._id,
          value: item.value,
        };

        return newField;
      }),
    );

    newFields.forEach((field) => documentData.elements.push(field));

    const document = await Document.create(documentData);

    database.documents.push(document);

    await database.save();

    res.status(200).json({ database });
  } catch (error) {
    console.error("Error while creating documents", error);
    res.status(500).json({ error: "Failed to create document" });
  }
};
