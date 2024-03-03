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
    // otp generated
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    const mailOptions = {
      from: "prateeksrivastava702@gmail.com",
      to: req.body.email, // Use the provided email address
      subject: "Your OTP for Registration",
      text: `Your OTP for registration is: ${otp}`,
    };
    // otp send
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).send("Error sending OTP via email");
      } else {
        console.log("Email sent: " + info.response);
        // Proceed with user creation
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        await User.create({
          username: req.body.name,
          email: req.body.email,
          password: hashedPassword
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
    });
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).send("Error Occurred");
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

module.exports = { createuser, login };