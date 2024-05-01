const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const fetchuser = require('../middleware/fetchuser');
const User = require('../models/User'); // Import the User model

const router = express.Router();

// Route to create a user
router.post('/createuser', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('name', "Enter a Valid Name").isLength({ min: 3 }),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
], authController.createuser);
router.post('/verify-otp', authController.getuserotp);

// Route for user login
router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], authController.login);

// Route to get all users
router.get('/getusers', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/updateUser/:email', async (req, res) => {
    const email = req.params.email;

    try {
        // Find the user by email and update the hasBooked field to false
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { $set: { booked: false } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getuser', fetchuser, authController.getuser);
router.get('/getuserr/:id', fetchuser, authController.getuserr);


// router.delete('/:userId',fetchuser, authController.deleteUser);
module.exports = router;
