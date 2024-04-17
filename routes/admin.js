// routes/rideRoutes.js
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
// const Ride = require('../models/Ride');
// const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware
const adminController=require(".././controllers/adminController");
// const fetchuser = require('../middleware/fetchuser');

//router.post('/create', rideController.create);
router.get('/listunverified', adminController.listunverified);
router.post('/accept/:id',adminController.accept);
router.post('/reject/:id',adminController.reject);

module.exports = router;
