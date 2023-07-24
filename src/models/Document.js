const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  elements: [
    {
      field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field",
      },
      value: {
        type: String,
        required: [true, "Value is required"],
        default: "",
      },
    },
  ],
});

exports.documentSchema = documentSchema;
exports.Document = mongoose.model("Document", documentSchema);
