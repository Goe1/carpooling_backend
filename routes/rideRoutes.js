// routes/rideRoutes.js
const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware

// Create a new ride
router.post('/create', async (req, res) => {
  try {
    const { startingLocation, destination, date, availableSeats,userEmail,price,departureTime, estimatedArrivalTime } = req.body;

    const ride = new Ride({
      driver: userEmail,
      startingLocation,
      destination,
      date,
      availableSeats,
      price,
      departureTime,
      estimatedArrivalTime
    });
    console.log('karre hai save')

    await ride.save();
    res.json({ message: 'Ride created successfully', ride });
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// List available rides
router.get('/list', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Apply for a ride
router.post('/apply',  async (req, res) => {
  try {
    const { rideId } = req.body;
    const userEmail = req.userEmail;

    // Check if user has already applied
    const ride = await Ride.findById(rideId);

    if (ride.applicants.includes(userEmail)) {
      return res.status(400).json({ message: 'You have already applied for this ride.' });
    }

    // Check if there's at least one available seat
    if (ride.availableSeats < 1) {
      return res.status(400).json({ message: 'No available seats for this ride.' });
    }

    // Update the ride with the new applicant and reduce availableSeats
    ride.applicants.push(userEmail);
    ride.availableSeats -= 1;

    await ride.save();

    res.json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Error applying for ride:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;