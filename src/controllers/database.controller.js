/* eslint-disable consistent-return */
const mongoose = require("mongoose");

const User = require("../models/User");
const { Database } = require("../models/Database");
const { Document } = require("../models/Document");
const { Field } = require("../models/Field");

exports.getAllDatabases = async function (req, res, next) {
  const userId = req.params.userid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const databases = await Database.find({
      "createdBy._id": new mongoose.Types.ObjectId(userId),
    })
      .populate("createdBy")
      .populate("documents")
      .exec();

    res.status(200).json({ databases });
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
      .exec();

    if (!database) {
      return res.status(404).json({ error: "Database Not Found" });
    }

    res.status(200).json({ database });
  } catch (err) {
    console.error("Error while fetching database", err);
    res.status(500).json({ error: "Failed to retrieve database" });
  }
};

exports.deleteDatabase = async function (req, res, next) {
  const databaseId = req.params.databaseid;

  try {
    await Database.findByIdAndDelete(databaseId);

    res.status(200).json("Database successfully deleted");
  } catch (err) {
    console.error("Error while fetching database", err);
    res.status(500).json({ error: "Failed to delete database" });
  }
};
