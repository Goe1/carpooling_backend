const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.listunverified = async (req,res)=>{
    //, role: "driver" 
    try{
        const users = await User.find({ isVerified: false});
        console.log("users by admin");
        console.log(users);
        return res.json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).send("Error Occured");
    }
}

module.exports.accept = async (req,res)=>{
    //, role: "driver" 
    const idd = req.params.id;
    console.log(idd);
    try{
        const users = await User.findOneAndUpdate(
            { _id: idd },
            { $set: { isVerified: true } },
            { new: true }
          );
        console.log("users by admin");
        console.log(users);
        return res.json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).send("Error Occured");
    }
}

module.exports.reject = async (req,res)=>{
    //, role: "driver" 
    const idd = req.params.id;
    console.log(idd);
    try{
        const users = await await User.findByIdAndDelete(idd);
        console.log(users);
        return res.json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).send("Error Occured");
    }
}