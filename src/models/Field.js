const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Fieldname is required"],
  },
  type: {
    type: String,
    required: [true, "Fieldtype is required"],
  },
});

module.exports = mongoose.model("Field", fieldSchema);
