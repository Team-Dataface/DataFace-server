const mongoose = require("mongoose");

const { Schema } = mongoose;

const fieldSchema = new Schema({
  name: {
    type: String,
    required: [true, "Fieldname is required"],
    default: "",
  },
  type: {
    type: String,
    required: [true, "Fieldtype is required"],
    default: "",
  },
});

module.exports = mongoose.model("Field", fieldSchema);
