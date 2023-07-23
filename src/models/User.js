const mongoose = require("mongoose");

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
  databases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Database",
    },
  ],
  refreshToken: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
