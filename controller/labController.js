const express = require('express');
const router = express.Router();

const Lab = require('../model/Labs');
const Reservation = require('../model/Reservations');
const User = require('../model/Users');


//Get all labs
router.get('/labs', async (req, res) => {

    try {

        const labs = await Lab.find();

        res.json(
            labs.map(l => ({
                id: l._id,
                name: l.name,
                seats: l.totalSeats
            }))
        );

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});


//Get lab availability
router.get('/labs/:id/availability', async (req, res) => {

    try {

        const labId = req.params.id;
        const { date, time } = req.query;

        const lab = await Lab.findById(labId);

        if (!lab) {
            return res.status(404).json({ message: "Lab not found." });
        }

        const reservations = await Reservation.find({
            labId: labId,
            date: date,
            time: time
        }).populate("userId");

        const availability = [];

        for (let seat = 1; seat <= lab.totalSeats; seat++) {

            const reservation = reservations.find(r => r.seat === seat);

            if (!reservation) {

                availability.push({
                    seat,
                    available: true
                });

            } else {

                availability.push({
                    seat,
                    available: false,
                    anonymous: reservation.anonymous,
                    userId: reservation.userId._id,
                    userName: reservation.userId.name
                });

            }
        }

        res.json(availability);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

module.exports = router;
