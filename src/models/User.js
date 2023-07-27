const mongoose = require("mongoose");

const { Schema } = mongoose;

const documentSchema = new Schema({
  fields: [
    {
      fieldName: {
        type: String,
        required: true,
      },
      fieldType: {
        type: String,
        required: true,
      },
      fieldValue: {
        type: String,
        required: true,
      },
      xCoordinate: {
        type: Number,
        required: true,
        default: 0,
      },
      yCoordinate: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
});

const databaseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  documents: [documentSchema],
});

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  databases: [databaseSchema],
});

documentSchema.pre("validate", function (next) {
  this.fields = this.fields.map((field) => ({
    ...field,
    fieldValue: field.fieldValue || "default",
  }));
  next();
});

module.exports = mongoose.model("User", userSchema);
