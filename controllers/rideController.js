const express = require('express');
// const router = express.Router();
const Ride = require('../models/Ride');
const User=require('../models/User');
const mongoose=require('mongoose');

const create = async (req, res) => {
    try {
        const { startingLocation, destination, date, availableSeats, userEmail,license,starttime,endtime,name} = req.body;
        console.log(req.body);
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
            license:license
        });
        // console.log('karre hai save')
        await ride.save();
        res.json({ message: 'Ride created successfully', ride });
    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
const getride = async (req, res) => {
  try {
    // console.log("here");
    const rideId = req.params.id; 
    const ride = await Ride.findById(rideId); 

    if (!ride) {
        return res.status(404).json({ message: 'Ride not found' }); 
    }

    res.status(200).json(ride); 
} catch (error) {
    console.error('Error retrieving ride:', error);
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
const mylist = async (req, res) => {
    // console.log("lll");
    // const email = req.params.email;
    const email=req.user.id;
    console.log(req.user);
    try {
      // Your logic to fetch rides based on the email
      // For example:
      
      const rides = await User.find({_id: email }); // Assuming driver field stores the email
      const eemail=rides[0].email;
    //   console.log(eemail,"ridesssss");
    //   console.log(rides,"ridesssss");
      const myrides=await Ride.find({driver :eemail}); 
      console.log(myrides,"myri" +myrides.length);


      res.json(myrides);
    } catch (error) {
      console.error('Error fetching rides:', error);
      res.status(500).json({ error: 'Internal Sennrver Error' });
    }
  };

  // const deleteRide = async (req, res) => {
  //   const rideId = req.params.rideId;
  //   console.log('Deleting ride with ID:', rideId);
  
  //   try {
  //     // Find the ride by ID
  //     const ride = await Ride.findById(rideId);
  //     console.log('Found ride:', ride);
  
  //     if (!ride) {
  //       return res.status(404).json({ message: 'Ride not found' });
  //     }
  
  //     // Delete the ride
  //     await ride.deleteOne();
  
  
  //     // Return success message
  //     console.log('hogya delete');
  //     res.json({ message: 'Ride deleted successfully' });
  //   } catch (error) {
  //     console.error('Error deleting ride:', error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // };
  

module.exports = { create,list,mylist,getride };