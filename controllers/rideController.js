const express = require('express');
// const router = express.Router();
const Ride = require('../models/Ride');
const User=require('../models/User');

const create = async (req, res) => {
    try {
        const { startingLocation, destination, date, availableSeats, userEmail,starttime,endtime,name,formDataWithLicense } = req.body;
        console.log(formDataWithLicense);
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
            document:formDataWithLicense
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
const mylist = async (req, res) => {
    console.log("lll");
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
  
  

module.exports = { create,list,mylist };