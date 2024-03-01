// Assuming you have a 'mongoose' instance set up
const mongoose = require('mongoose');

// Define the Ride schema
const rideSchema = new mongoose.Schema({
  driver: {
    type: String, // Assuming storing the driver's email as a string
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
    min: 1, // Assuming there should be at least one available seat
  },
});

// Create the Ride model
const Ride = mongoose.model('Ride', rideSchema);

// Export the model
module.exports = Ride;
