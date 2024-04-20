const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
 
 
});

const Message = mongoose.model('Message', userSchema);

module.exports = Message;
