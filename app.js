const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const axios = require('axios');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
const mapRoutes = require('./routes/map');


const Message = require('./models/messages');

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: '*' // Set CORS origin to allow requests from any origin
  }
});

dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware to enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/carpooling-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit process with failure
});

// Proxy endpoint
app.get('/api/places/search', async (req, res) => {
  const bearerToken = "a0703a07-023b-4f47-a783-d8111dfc81ee";
  console.log("Received search request for:", req.query.query);
  try {
    const response = await axios.get(`https://atlas.mapmyindia.com/api/places/search/json`, {
      params: {
        query: req.query.query,
        itemCount: 5
      },
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    });
    console.log("Received response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'An error occurred while proxying the request' });
  }
});


// Define socket.io logic
const users = {};
io.on('connection', socket => {
  socket.on('new-user-joined', name => {
    console.log(`${name} has joined`);
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });

  socket.on('send-message', async ({ id,message, sender, reciever }) => {
    const create = async () => {
      try {
        const newMessage = new Message({
          rideid:id,
          message: message,
          sender: sender,
          reciever: reciever
        });
      
        await newMessage.save();
      } catch (error) {
        console.error('Error saving message:', error);
        // Handle the error appropriately, e.g., emit an error event to the client
        socket.emit('error', { message: 'Internal Server Error' });
      }
    };
    
    await create();
    socket.broadcast.emit('recieve-message', { message: message, sender: sender, reciever: reciever, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    console.log(`${users[socket.id]} has left`);
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

// Define routes
app.use('/auth', authRoutes);
app.use('/rides', rideRoutes);
app.use('/api/map', mapRoutes);

// Drop the 'reciever' index only if it exists
Message.collection.dropIndex({ reciever: 1 }, function(err, result) {
  if (err) {
    console.error('Error dropping index:', err);
  } else {
    console.log('Index dropped successfully:', result);
  }
});

// Drop the 'sender' index only if it exists
Message.collection.dropIndex({ sender: 1 }, function(err, result) {
  if (err) {
    console.error('Error dropping index:', err);
  } else {
    console.log('Index dropped successfully:', result);
  }
});

// Drop the 'message' index only if it exists
Message.collection.dropIndex({ message: 1 }, function(err, result) {
  if (err) {
    console.error('Error dropping index:', err);
  } else {
    console.log('Index dropped successfully:', result);
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
