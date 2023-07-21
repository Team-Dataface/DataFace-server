const mongoose = require("mongoose");

const { Schema } = mongoose;

const documentSchema = new Schema({
  elements: [
    {
      field: {
        type: Schema.Types.ObjectId,
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

const databaseSchema = new Schema({
  name: {
    type: String,
    required: [true, "Database name is required"],
    default: "",
  },
  documents: {
    type: [documentSchema],
    default: [],
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  databases: {
    type: [databaseSchema],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
