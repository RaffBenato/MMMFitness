const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  password: String,
  isadmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
