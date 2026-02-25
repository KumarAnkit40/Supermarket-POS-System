const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "cashier"], default: "cashier" },
  name: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
