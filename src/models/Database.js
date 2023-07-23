const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Database name is required"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
});

module.exports = mongoose.model("Database", databaseSchema);
