const mongoose = require("mongoose");
const { databaseSchema } = require("./Database");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  refreshToken: {
    type: String,
  },
  databases: [databaseSchema],
});

module.exports = mongoose.model("User", userSchema);
