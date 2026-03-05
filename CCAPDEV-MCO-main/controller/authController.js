const express = require('express');
const router = express.Router();

const Users = require('../model/Users');

//login route
router.post('/login', (req, res) => {

    const { email, password } = req.body;

    const user = Users.findByEmail(email);

    if (!user || user.password !== password) {
        return res.json({
            success: false,
            message: "Invalid email or password."
        });
    }

    res.json({
        success: true,
        user
    });
});


//signup route
router.post('/signup', (req, res) => {
    const { fName, lName, email, password, role } = req.body;

    //check if already exists through email
    const existingUser = Users.findByEmail(email);

    if (existingUser){
        return res.json({
            success: false,
            message: "Email already registered."
        });
    }

    const newUser = {
        id: Date.now(),
        name: `${fName} ${lName}`,
        email,
        password,
        role,
        description: ""
    };

    Users.addUser(newUser);

    res.json({
        success: true,
        user: newUser
    });
});

module.exports = router;