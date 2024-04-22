const express = require('express');
// const router = express.Router();
const Ride = require('../models/Ride');
const User=require('../models/User');
const stripe = require("stripe")("sk_test_51P8TDCSDhYcpKPnMNGFQvjwMaXt2m9PPEd5hwCgQ1gWe0irTRrMyBFRcHUx3lWJ0rQ80tNvkq9xe1idwuxlDap5F00hgzqZ8aG")

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

const createCheckoutSession = async (req,res)=>{ 
  const {start,end,price} = req.body;
  console.log(price);
  let str = start + " to " + end;
  const session = await stripe.checkout.sessions.create({
    payment_method_types : ["card"],
    line_items: [
      {
        price_data: {
          currency : "inr",
          product_data : {
            name : str
          },
          unit_amount : 100
        },
        quantity: 1,
      }
    ],
    mode: 'payment',
    success_url: 'http://localhost:3001/success',
    cancel_url: 'http://localhost:3001/cancel',
  });
  res.json({id:session.id});
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
  
  

module.exports = { create,list,mylist,getride ,createCheckoutSession};