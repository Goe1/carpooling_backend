// routes/rideRoutes.js
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
// const Ride = require('../models/Ride');
// const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware
const rideController=require(".././controllers/rideController");
// const fetchuser = require('../middleware/fetchuser');

router.post('/create', rideController.create);
router.post('/create-checkout-session/:id', rideController.createCheckoutSession);
router.get('/list', rideController.list);
router.get('/mylist',fetchuser,rideController.mylist);
router.get('/prevmessages/:id',fetchuser,rideController.prevMessages);
router.get('/rides-details/:id',fetchuser,rideController.getride);
router.get('/getuserr/:id',fetchuser,rideController.getuserr);
router.post('/addapplicant/:id',fetchuser,rideController.addapplicant);
router.post('/update/:id',fetchuser,rideController.update);

// module.exports = router;
module.exports = router;