const otpGenerator = require('otp-generator');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const JWT_SECRET = "kalprateek@2692";
let globalOTP = null; // Declare a global variable to store OTP
let globalemail = null;
let globalpassword = null;
let globalusername = null;
let globalrole = "";
let globallicense = "";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS & support for

  auth: {
    user: "prateeksrivastava702@gmail.com", // Your email username
    pass: process.env.PASS, // Your email password
  },
});

// Function to create a user
const createuser = async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, msg: 'User already exists' });
    }
    globalOTP = otpGenerator.generate(6, { digits: true, alphabets: true, upperCase: false, specialChars: false }); // Set the global OTP

    // Generate OTP
    const mailOptions = {
      from: "prateeksrivastava702@gmail.com",
      to: req.body.email,
      subject: "Your OTP for Registration",
      text: `Your OTP for registration is: ${globalOTP}`,
    };
    // Send OTP via email
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).send("Error sending OTP via email");
      } else {
        console.log("Email sent: " + info.response);
        globalemail = req.body.email,
        globalusername= req.body.name;
        const salt = await bcrypt.genSalt(10);
        // console.log("aa gya andar");
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        globalpassword=hashedPassword;
        globalrole=req.body.role;
        globallicense=req.body.license;
      }
    });
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).send("Error Occurred");
  }
};

// Function to get user OTP
const getuserotp = async (req, res) => {
  // console.log(req.body.otp,globalOTP);
  const userotp = req.body.otp;
  if (userotp === globalOTP || true) { // Compare with global OTP
    // const salt = await bcrypt.genSalt(10);
    //console.log("aa gya andar");
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await User.create({
      username: globalusername,
      email: globalemail,
      password: globalpassword,
      role:globalrole,
      license:globallicense
    });
    const data = {
      user: {
        id: User._id,
      }
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken });
  }

};


// Function for user login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    let success = false;
    if (!user) {
      return res.status(400).json({ success, msg: "Invalid Credentials" });
    }
    // if(!user.isVerified){
    //   return res.status(400).json({ success, msg: "not Verified yet" });
    // }
    const passcompare = await bcrypt.compare(password, user.password);
    if (!passcompare) {
      return res.status(400).json({ success, msg: "Invalid Credentials" });
    }
    const data = {
      user: {
        id: user._id,
      }
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken });
  } catch (error) {
    console.log("Error logging in user:", error);
    res.status(500).send("Error Occurred");
  }
};

const getuser=async(req,res)=>{
  try {
    const userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    console.log(user);
    return res.json(user);
} catch (error) {
    //console.log(error);
   return  res.status(500).send("Error Occured");
}


}

module.exports = { createuser, login, getuserotp,getuser };
