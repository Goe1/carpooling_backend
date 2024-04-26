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
  role:{
    type:String,
    default:"passenger"
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  license:{
    type:String
  },
  booked: {
    type: Boolean,
    default : false
  },
  ride_id:{
    type:String,
    default:""
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
