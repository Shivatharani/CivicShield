const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "VIEWER" }
});

module.exports = mongoose.model("User", userSchema);