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
