const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkoutSchema = new mongoose.Schema({
  title: String,
  workout: String,
});

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
  dateofbirth: Date,
  age: Number,
  gender: String,
  address: String,
  city: String,
  postcode: String,
  emergencycontact: String,
  emergencynumber: String,
  startdate: Date,
  workouts: [WorkoutSchema],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
