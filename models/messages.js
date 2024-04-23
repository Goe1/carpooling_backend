const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    rideid:{
    type: String,
    required: true,
    },
  message: {
    type: String,
    required: true,
   
  },
  sender: {
    type: String,
    required: true,
 
  },
  reciever: {
    type: String,
    required: true,
   
  },
  tim: {
    type: Date,
    default: Date.now // Default value is set to the current time
  }
 
 
});

const Message = mongoose.model('Message', userSchema);

module.exports = Message;
