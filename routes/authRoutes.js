const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const fetchuser = require('../middleware/fetchuser');

const router = express.Router();

// Route to create a user
router.post('/createuser', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('name', "Enter a Valid Name").isLength({ min: 3 }),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
], authController.createuser);
router.post('/verify-otp',authController.getuserotp);

// Route for user login
router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], authController.login);

router.get('/getuser', fetchuser,authController.getuser);
module.exports = router;