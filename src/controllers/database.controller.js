/* eslint-disable consistent-return */
const User = require("../models/User");
const { Database } = require("../models/Database");
const { Field } = require("../models/Field");
const { Document } = require("../models/Document");

exports.getAllDatabases = async function (req, res, next) {
  const userId = req.params.userid;

  try {
    const user = await User.findById(userId)
      .populate("databases.documents")
      .populate("databases.fields");

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const { databases } = user;

    res.status(200).json({ databases, user });
  } catch (err) {
    console.error("Error while fetching databases", err);
    res.status(500).json({ error: "Failed to retrieve databases" });
  }
};

exports.createDatabase = async function (req, res, next) {
  const userId = req.params.userid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const newDatabase = await Database.create({
      name: req.body.dbName,
      createdBy: userId,
    });

    await Promise.all(
      req.body.fields.map(async (item) => {
        const field = await Field.create({ name: item.name, type: item.type });
        newDatabase.fields.push(field);

        return field;
      }),
    );

    user.databases.push(newDatabase);
    await newDatabase.save();
    await user.save();

    res.status(201).json({ newDatabase, user });
  } catch (error) {
    console.error("Error while fetching database", error);
    res.status(500).json({ error: "Failed to create database" });
  }
};

exports.getDatabase = async function (req, res, next) {
  const databaseId = req.params.databaseid;

  try {
    const database = await Database.findById(databaseId)
      .populate("createdBy")
      .populate("documents")
      .populate("fields")
      .exec();

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    res.status(200).json({ database });
  } catch (error) {
    console.error("Error while fetching database", error);
    res.status(500).json({ error: "Failed to retrieve database" });
  }
};

exports.deleteDatabase = async function (req, res, next) {
  const userId = req.params.userid;
  const databaseId = req.params.databaseid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const deletedDatabase = await Database.findByIdAndDelete(databaseId);

    const documentIds = [];
    const fieldIds = [];

    deletedDatabase.documents.forEach(function (document) {
      documentIds.push(document._id);
    });

    deletedDatabase.fields.forEach(function (field) {
      fieldIds.push(field._id);
    });

    await Document.deleteMany({ _id: { $in: documentIds } });
    await Field.deleteMany({ _id: { $in: fieldIds } });

    user.databases = user.databases.filter(function (database) {
      return database.id !== databaseId;
    });

    await user.save();

    res.status(200).json("Database successfully deleted");
  } catch (error) {
    console.error("Error while fetching database", error);
    res.status(500).json({ error: "Failed to delete database" });
  }
};
