const express = require('express');
const router = express.Router();


const Users = require('../model/Users');

//login route
router.post('/login', async(req, res) => {
try {
        const { email, password } = req.body;
        // Use Mongoose findOne instead of array find
        const user = await Users.findOne({ email });

        if (!user || user.password !== password) {
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

    //check if already exists through email
    const existingUser = await Users.findOne({email});

    if (existingUser){
        return res.json({
            success: false,
            message: "Email already registered."
        });
    }

    const newUser = {
        name: `${fName} ${lName}`,
        email,
        password,
        role,
        description: ""
    };

    await newUser.save();

    res.json({
        success: true,
        user: newUser
    });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
