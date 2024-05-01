const express = require('express');
const Ride = require('../models/Ride');
const Message = require('../models/messages');
const User = require('../models/User');
const stripe = require("stripe")("sk_test_51P8TDCSDhYcpKPnMNGFQvjwMaXt2m9PPEd5hwCgQ1gWe0irTRrMyBFRcHUx3lWJ0rQ80tNvkq9xe1idwuxlDap5F00hgzqZ8aG");
const axios = require("axios");
function generateRandomId() {
  return 'id_' + Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
}

const create = async (req, res) => {
  try {
    const { startingLocation, destinations, date, availableSeats, userEmail, license, starttime, endtime, name } = req.body;
   
    // const positions = [];
    const addresses = [startingLocation, ...destinations];
    // const generateMarkerData = async () => {
    //   try {
    //     for (const address of addresses) {
    //       try {
    //         const response = await axios.get(
    //           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    //             address
    //           )}`
    //         );
    //         const data = response.data;
    //         if (data.length > 0) {
    //           const { lat, lon } = data[0];
    //           positions.push([parseFloat(lat), parseFloat(lon)]);
    //         } else {
    //           console.error(`No coordinates found for address: ${address}`);
    //         }
    //       } catch (error) {
    //         console.error(`Error geocoding address: ${address}`, error);
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error generating marker data:", error);
    //   }
    // };
    // await generateMarkerData();
    
    // const price = [];
    // for (let i = 0; i < positions.length; i++) {
    //   try {
    //     const response = await axios.get(`http://localhost:3000/api/map/distancematrix?origins=${positions[0][1]},${positions[0][0]}&destinations=${positions[i][1]},${positions[i][0]}`);
    //     const idd = generateRandomId();
    //     console.log(response.data.results.distances[0][1]);
    //     price.push({ destinationId: addresses[i], price: parseInt((response.data.results.distances[0][1] / 8000) * 0.60 )});
    //   } catch (error) {
    //     console.error('Error fetching distance matrix:', error);
    //     return res.status(500).json({ error: 'An error occurred while fetching distance matrix' });
    //   }
    // }
    const ride = new Ride({
      driver: userEmail,
      startingLocation,
      destinations:addresses,
      date,
      availableSeats,
      departureTime: endtime,
      estimatedArrivalTime: starttime,
      license,
      // price: price
    });
    await ride.save();
    res.json({ message: 'Ride created successfully', ride });
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const createCheckoutSession = async (req, res) => {
  try {
    const idd = req.params.id;
    const { start, end, price } = req.body;
    console.log(price);
    let str = start + " to " + end;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: str
            },
            unit_amount: price * 100
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `http://localhost:3001/success/${idd}/${encodeURIComponent(start)}/${encodeURIComponent(end)}`,
      cancel_url: 'http://localhost:3001/home',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getuserr = async (req, res) => {
  try {
    const id = req.params.id;
    const ress = await User.find({_id:id});
    res.json(ress);
  } catch (error) {
    console.error('Error updating ride:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const complete = async (req, res) => {
  try {
    const id = req.params.id;
    const ress = await Ride.findByIdAndUpdate(id, { completed:true }, { new: true });
    res.json(ress);
  } catch (error) {
    console.error('Error updating ride:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const update = async (req, res) => {
  try {
    console.log("updatee");
    const id = req.params.id;
    const start = req.params.start;
    const end = req.params.end;
    const otpp = req.params.otp;
    const user_id = req.user.id;
    console.log(id);
    console.log(start);
    console.log(end);
    console.log(otpp);
    const ress = await User.findByIdAndUpdate(user_id, { booked: true, ride_id: id,otp:otpp,start:start,end:end }, { new: true });
    if (ress) {
      res.status(200).json("ok");
    }
  } catch (error) {
    console.error('Error updating ride:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addapplicant = async (req, res) => {
  console.log("kokdoiswuoiewi");
  const id = req.params.id;
  console.log(req.user.id);
  const user_id = req.user.id;
  try {
    console.log(user_id);
    const ress2 = await Ride.find({ _id: id });
    // const avai = parseInt(ress2.availableSeats) - 1;
    // console.log(avai);
    //$set: { availableSeats: avai } 
    const ress = await Ride.findOneAndUpdate({ _id: id }, { $push: { applicants: user_id }}, { new: true });
    console.log("addapplicant");
    //console.log(ress);
    if (ress) {
      res.status(200).json("ok");
    }
  } catch (error) {
    console.error('Error adding applicant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

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
};

const list = async (req, res) => {
  try {
    const rides = await Ride.find({completed:false});
    res.json(rides);
  } catch (error) {
    console.error('Error listing rides:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const mylist = async (req, res) => {
  try {
    const email = req.user.id;
    // console.log(req.user);
    const rides = await User.find({ _id: email });
    const eemail = rides[0].email;
    const myrides = await Ride.find({ driver: eemail });
    // console.log(myrides, "myri" + myrides.length);

    res.json(myrides);
  } catch (error) {
    console.error('Error fetching user rides:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
      time: message.tim
    }));

    const receiverMessages = recvmess
      .filter(message => message.sender !== message.reciever)
      .map(message => ({
        sender: message.sender,
        receiver: message.reciever,
        message: message.message,
        time: message.tim
      }));

    // console.log("senderMessages", senderMessages);
    // console.log("receiverMessages", receiverMessages);

    res.json({ senderMessages, receiverMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { create, list, mylist, getride, prevMessages, createCheckoutSession, update, addapplicant,getuserr,complete };
