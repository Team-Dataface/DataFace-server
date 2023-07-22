const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Database name is required"],
  },
  documents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },
});

module.exports = mongoose.model("Database", databaseSchema);
