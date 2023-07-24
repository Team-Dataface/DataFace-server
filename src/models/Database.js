const mongoose = require("mongoose");
const { fieldSchema } = require("./Field");
const { documentSchema } = require("./Document");

const databaseSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Database name is required"],
  },
  documents: [documentSchema],
  fields: [fieldSchema],
});

exports.databaseSchema = databaseSchema;
exports.Database = mongoose.model("Database", databaseSchema);
