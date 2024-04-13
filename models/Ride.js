const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: {
    type: String, // Assuming email is used as a unique identifier for the driver
    required: true,
  },
  startingLocation: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
  },
  applicants: [
    {
      type: String, // Assuming email is used as a unique identifier for applicants
    },
  ],
  departureTime: { 
    type: String, 
    required: true 
  },
  estimatedArrivalTime: { 
    type: String, 
    required: true 
  },
  // Add field for PDF document
  license: {
    type:String
  }
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
