// server.js (or app.js)
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes'); // Import rideRoutes

const app = express();
const PORT = process.env.PORT || 3000;

// Use cors middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/carpooling-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Set the destination directory for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Set the file name
//   }
// });

// const upload = multer({ storage: storage });
// app.use(upload.single('formDataWithLicense'));
// app.post('/rides/create', upload.single('formDataWithLicense'), async(req, res) => {
//   try {
//     const { startingLocation, destination, date, availableSeats, userEmail,starttime,endtime,name} = req.body;
//     const { formDataWithLicense } = req.file;
//     console.log(formDataWithLicense);
//     console.log("license");

//     const ride = new Ride({
//         driver: userEmail,
//         startingLocation,
//         destination,
//         date,
//         availableSeats,
//         applicants:name,
//         departureTime:endtime,
//         estimatedArrivalTime:starttime,
//         document: { // Assuming 'document' is a field in your Ride model to store the uploaded file
//             data: formDataWithLicense.data, // Accessing the file data
//             contentType: formDataWithLicense.mimetype // Accessing the file content type
//         }
//     });
//     // console.log('karre hai save')

//     await ride.save();
//     console.log("ok");
//     res.json({ message: 'Ride created successfully', ride });
// } catch (error) {
//     console.error('Error creating ride:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
// }
  
// });
app.use('/auth', authRoutes);
app.use('/rides', rideRoutes); // Use rideRoutes for '/rides' endpoint

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const otpGenerator = require("otp-generator");
// const nodemailer = require("nodemailer");
// const User = require("./models/User");
// dotenv.config({ path: "./config/.env" });

// const authRoutes = require("./routes/authRoutes");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Use cors middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/carpooling-app", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false, // Insecure, consider using true in production
//   },
// });

// // Endpoint to send OTP to the provided email
// app.post("/auth/send-otp", async (req, res) => {
//   const { email } = req.body;

//   // Generate OTP
//   const otp = otpGenerator.generate(6, {
//     upperCase: false,
//     specialChars: false,
//     alphabets: false,
//   });

//   // Send OTP to the email
//   const mailOptions = {
//     from: process.env.EMAIL_USERNAME,
//     to: email,
//     subject: "Your OTP for Registration",
//     text: Your OTP for registration is: ${otp},
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(OTP sent to ${email});
//     res.json({ otp }); // For demo purposes, sending OTP back in the response
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// });

// // Endpoint to handle user signup with OTP verification
// app.post("/auth/signup", async (req, res) => {
//   const { username, email, password, otp, storedOTP } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   // Check if the OTP matches the storedOTP
//   if (otp !== storedOTP) {
//     return res.status(400).json({ message: "Invalid OTP" });
//   }

//   // Create a new user document
//   const newUser = new User({
//     username: username,
//     email: email,
//     password: password,
//   });

//   try {
//     // Save the new user to the database
//     const savedUser = await newUser.save();
//     console.log("User saved to database:", savedUser);
//     res
//       .status(200)
//       .json({ message: "Registration successful", user: savedUser });
//   } catch (error) {
//     console.error("Error saving user to database:", error);
//     res.status(500).json({ error: "Failed to save user to database" });
//   }
// });

// app.use("/auth", authRoutes);

// app.listen(PORT, () => {
//   console.log(Server is running on port ${PORT});
// });