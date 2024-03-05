const express = require('express');
// const router = express.Router();
const Ride = require('../models/Ride');

const create = async (req, res) => {
    try {
        const { startingLocation, destination, date, availableSeats, userEmail,starttime,endtime,name} = req.body;
        //const { formDataWithLicense } = req.files;
        //console.log(formDataWithLicense);
        console.log("license");

        const ride = new Ride({
            driver: userEmail,
            startingLocation,
            destination,
            date,
            availableSeats,
            applicants:name,
            departureTime:endtime,
            estimatedArrivalTime:starttime,
            // document: { // Assuming 'document' is a field in your Ride model to store the uploaded file
            //     data: formDataWithLicense.data, // Accessing the file data
            //     contentType: formDataWithLicense.mimetype // Accessing the file content type
            // }
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