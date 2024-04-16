// server.js (or app.js)
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const io = require("socket.io")(3002);

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

const users = {};
io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log(`${name} has joined`);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send-message', message => {
        // Broadcast the message to all connected clients
        socket.broadcast.emit('receive-message', message);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
