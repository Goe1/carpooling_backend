// routes/rideRoutes.js
const express = require('express');
const router = express.Router();
// const Ride = require('../models/Ride');
// const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware
const rideController=require(".././controllers/rideController");

router.post('/create', rideController.create);
router.get('/list', rideController.list);
// module.exports = router;
module.exports = router;