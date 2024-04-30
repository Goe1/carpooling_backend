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
  destinations: [
    {
      type: String,
      required: true,
    },
  ],
  date: {
    type: Date,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  price: [
    {
      destinationId: {
        type: String, 
      },
      price: {
        type: Number,
      },
    }
  ],

  applicants: [
    {
      type: String,
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

  license: {
    type: String
  }
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
