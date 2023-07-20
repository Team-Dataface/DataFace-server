const mongoose = require("mongoose");

const { Schema } = mongoose;

const fieldSchema = new Schema({
  name: String,
  type: String,
});

const documentSchema = new Schema({
  elements: [
    {
      field: {
        type: Schema.Types.ObjectId,
        ref: "Field",
      },
      value: String,
    },
  ],
});

const databaseSchema = new Schema({
  name: String,
  documents: [documentSchema],
  fields: [fieldSchema],
});

const userSchema = new Schema({
  username: String,
  email: String,
  databases: [databaseSchema],
});

module.exports = mongoose.model("User", userSchema);
