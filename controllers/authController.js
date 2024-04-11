const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = "kalprateek@2692";
let globalOTP = null;
let globalemail = null;
let globalpassword = null;
let globalusername = null;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "prateeksrivastava702@gmail.com",
    pass: process.env.PASS,
  },
});

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

    globalOTP = otpGenerator.generate(6, { digits: true, alphabets: true, upperCase: false, specialChars: false });
    const mailOptions = {
      from: "prateeksrivastava702@gmail.com",
      to: req.body.email,
      subject: "Your OTP for Registration",
      text: `Your OTP for registration is: ${globalOTP}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).send("Error sending OTP via email");
      } else {
        console.log("Email sent: " + info.response);

        globalemail = req.body.email;
        globalusername = req.body.name;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        globalpassword = hashedPassword;

        // Assuming 'profilePicture' is the name attribute in the file input field
        const user = await User.create({
          username: globalusername,
          email: globalemail,
          password: globalpassword,
          photo: req.file.path,  // Add the profile picture field
        });

        const data = {
          user: {
            id: user._id,
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

const getuserotp = async (req, res) => {
  const userotp = req.body.otp;

  if (userotp === globalOTP) {
    await User.create({
      username: globalusername,
      email: globalemail,
      password: globalpassword
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

const getuser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    return res.json(user);
  } catch (error) {
    return res.status(500).send("Error Occurred");
  }
};

module.exports = { createuser, login, getuserotp, getuser };
