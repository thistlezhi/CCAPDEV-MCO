const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


const Users = require('../model/Users');

//login route
router.post('/login', async(req, res) => {
try {
        const { email, password } = req.body;
        // Use Mongoose findOne instead of array find
        const user = await Users.findOne({ email });
        //Use bcrypt to compare the hashed password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.json({ success: false, message: "Invalid email or password." });
        }

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});


//signup route
router.post('/signup', async (req, res) => {

    try {
        const { fName, lName, email, password, role } = req.body;
        const fullName = `${fName} ${lName}`;

    //check if already exists through email
    const existingUser = await Users.findOne({email});

    if (existingUser){
        return res.json({
            success: false,
            message: "Email already registered."
        });
    }

    const newUser = new Users({
        name: fullName,
        email,
        password,
        role,
        description: ""
    });

    await newUser.save();

    res.status(201).json({ success: true, user: newUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});
//Check email route
router.post('/check-email', async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (user) {
            return res.json({ exists: true });
        }
        res.json({ exists: false });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Password reset route
router.put('/reset-password', async (req, res) => {
    
    const { email, password } = req.body; 
    
    try {
        
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Update the password (the pre-save hook will hash it)
        user.password = password;
        await user.save();

        res.json({ success: true });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
module.exports = router;
