const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "passenger",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  license: {
    type: String,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  otp:{
    type:Number,
    default:0
  },
  start:{
    type:String,
    default:""
  },
  end:{
    type:String,
    default:""
  },
  ride_id: {
    type: String,
    default: "",
  },
  hasCreatedRide: {
    type: Boolean,
    default: false,
  }, // New field to track if the user has created a ride
});

const User = mongoose.model('User', userSchema);

module.exports = User;
