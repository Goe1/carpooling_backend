const express = require('express');
// const router = express.Router();
const Ride = require('../models/Ride');
const User = require('../models/User');
const Message = require('../models/messages');

const create = async (req, res) => {
  try {
    const { startingLocation, destination, date, availableSeats, userEmail, license, starttime, endtime, name } = req.body;
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
      applicants: name,
      departureTime: endtime,
      estimatedArrivalTime: starttime,
      license: license
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
    console.log("here");
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
  const email = req.user.id;
  console.log(req.user);
  try {
    const rides = await User.find({ _id: email });
    const eemail = rides[0].email;
    const myrides = await Ride.find({ driver: eemail });
    console.log(myrides, "myri" + myrides.length);


    res.json(myrides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Internal Sennrver Error' });
  }
};


const prevMessages = async (req, res) => {
  try {
    const rideid = req.params.id;
    const userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    const driver = user.email;

    const sendmess = await Message.find({ $and: [{ rideid: rideid }, { sender: driver }] });
    const recvmess = await Message.find({ $and: [{ rideid: rideid }, { reciever: driver }] });

    const senderMessages = sendmess.map(message => ({
      sender: message.sender,
      receiver: message.reciever,
      message: message.message,
      time:message.tim
      // Add other properties you want to extract
    }));

    const receiverMessages = recvmess
      .filter(message => message.sender !== message.reciever) // Filter out messages where sender is the same as receiver
      .map(message => ({
        sender: message.sender,
        receiver: message.reciever,
        message: message.message,
        time:message.tim
        // Add other properties you want to extract
      }));


    console.log("senderMessages", senderMessages);
    console.log("receiverMessages", receiverMessages);

    res.json({ senderMessages, receiverMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = { create, list, mylist, getride, prevMessages };