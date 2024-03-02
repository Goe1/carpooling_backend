const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "kalprateek@2692";

// Function to create a user
const createuser = async (req, res) => {
    const errors = validationResult(req);
    // console.log("here");
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);
        User.create({
            username: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: User._id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        res.status(500).send("Error Occurred");
    }
};

// Function for user login
const login = async (req, res) => {
    const errors = validationResult(req);
    // console.log("here");
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
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        res.status(500).send("Error Occurred");
    }
};


module.exports = {createuser,login};
