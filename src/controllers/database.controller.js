/* eslint-disable consistent-return */
const User = require("../models/User");
const Database = require("../models/Database");

exports.getAllDatabases = async function (req, res, next) {
  const userId = req.params.userid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const databases = await Database.find({ createdBy: user })
      .populate("createdBy")
      .populate("documents")
      .exec();

    res.status(200).json({ databases });
  } catch (err) {
    console.error("Error while fetching databases", err);
    res.status(500).json({ error: "Failed to retrieve databases" });
  }
};
