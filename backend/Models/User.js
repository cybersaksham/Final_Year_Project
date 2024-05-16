const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, uniqu: true },
  email: { type: String, required: true, uniqu: true },
  password: { type: String, required: true, uniqu: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdOn: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

module.exports = mongoose.model("users", UserSchema);
