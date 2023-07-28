/* eslint-disable consistent-return */
const User = require("../models/User");

exports.getAllDatabases = async function (req, res, next) {
  const userId = req.params.userid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const { databases } = user;

    res.status(200).json({ databases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve databases" });
  }
};

exports.createDatabase = async function (req, res, next) {
  const userId = req.params.userid;
  const { dbName, fields } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const fieldsArray = fields.map(({ fieldName, fieldType }) => ({
      fieldName,
      fieldType,
    }));

    const newDatabase = await user.databases.create({
      name: dbName,
      documents: [
        {
          fields: fieldsArray,
        },
      ],
    });

    user.databases.push(newDatabase);

    await user.save();

    res.status(201).json({ success: true, newDatabase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create database" });
  }
};

exports.getDatabase = async function (req, res, next) {
  const databaseId = req.params.databaseid;

  try {
    const user = await User.findOne({ "databases._id": databaseId });

    if (!user) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    const database = user.databases.find(
      (db) => db._id.toString() === databaseId,
    );

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    res.status(200).json({ database });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve database" });
  }
};

exports.deleteDatabase = async function (req, res, next) {
  const databaseId = req.params.databaseid;

  try {
    const user = await User.findOne({ "databases._id": databaseId });

    if (!user) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    user.databases.pull(databaseId);

    await user.save();

    res.status(200).json("Database and subdocuments deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete database" });
  }
};
