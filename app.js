// server.js (or app.js)
const express = require('express');
const mongoose = require('mongoose');
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

app.use('/auth', authRoutes);
app.use('/rides', rideRoutes); // Use rideRoutes for '/rides' endpoint

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
