const express = require('express');
// const router = express.Router();
const Ride = require('../models/Ride');

const create = async (req, res) => {
    try {
        const { startingLocation, destination, date, availableSeats, userEmail,starttime,endtime,name } = req.body;

        const ride = new Ride({
            driver: userEmail,
            startingLocation,
            destination,
            date,
            availableSeats,
            applicants:name,
            departureTime:endtime,
            estimatedArrivalTime:starttime,

        });
        // console.log('karre hai save')

        await ride.save();
        res.json({ message: 'Ride created successfully', ride });
    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const list = async (req, res) => {
    try {
        const rides = await Ride.find();
        res.json(rides);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { create,list };