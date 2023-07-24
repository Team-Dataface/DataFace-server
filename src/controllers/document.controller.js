const { Database } = require("../models/Database");

exports.getAllDocuments = async function (req, res, next) {
  const databaseId = req.params.databaseid;

  try {
    const database = await Database.findById(databaseId)
      .populate("documents")
      .populate("fields");

    const { documents } = database;

    res.status(200).json({ documents });
  } catch (err) {
    console.error("Error while fetching database", err);
    res.status(500).json({ error: "Failed to delete database" });
  }
};
