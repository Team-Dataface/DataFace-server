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
      },
    },
  ],
});

module.exports = mongoose.model("Document", documentSchema);
