const express = require('express');
const router = express.Router();

const Users = require('../model/Users');
const Reservations = require('../model/Reservations');

// GET USER
router.get('/users/:id', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

// UPDATE PROFILE
router.put('/users/:id', async (req, res) => {
    try {
        const { description, profilePic } = req.body;

        // findByIdAndUpdate is cleaner than finding then saving manually
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            { description, profilePic },
            { new: true } // This returns the updated document instead of the old one
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile" });
    }
});

// DELETE ACC
router.delete('/users/:id', async (req, res) => {
    try {
        // Delete the user
        await Users.findByIdAndDelete(req.params.id);
        
        // Delete all reservations associated with this userId
        await Reservations.deleteMany({ userId: req.params.id });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting account" });
    }
});

// GET RESERVATIONS OF USERS
router.get('/users/:id/reservations', async (req, res) => {
    try {
        // Find all reservations where userId matches the param
        const userReservations = await Reservations.find({ userId: req.params.id }).populate('labId');

        res.json(userReservations);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user reservations" });
    }
});

module.exports = router;