// routes/rideRoutes.js
const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware

// Create a new ride
router.post('/create', async (req, res) => {
  try {
    const { startingLocation, destination, date, availableSeats,userEmail } = req.body;

    // User email from authMiddleware

    if(userEmail === undefined)
    {
      res.status(500).json({ message: 'login kar pahle' });
    }

    console.log(userEmail)
    
    const ride = new Ride({
      driver: userEmail,
      startingLocation,
      destination,
      date,
      availableSeats,
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

module.exports = router;
