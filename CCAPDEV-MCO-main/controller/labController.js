const express = require('express');
const router = express.Router();

const Labs = require('../model/Labs');
const Reservations = require('../model/Reservations');
const Users = require('../model/Users');


// Get all labs
router.get('/labs', (req, res) => {
    res.json(Labs.getLabs());
});


// Get lab availability
router.get('/labs/:id/availability', (req, res) => {

    const labId = parseInt(req.params.id);
    const { date, time } = req.query;

    const lab = Labs.getLabs().find(l => l.id === labId);

    if (!lab) {
        return res.status(404).json({ message: "Lab not found." });
    }

    const reservations = Reservations.getAll()
        .filter(r =>
            r.labId === labId &&
            r.date === date &&
            r.time === time
        );

    //const takenSeats = reservations.map(r => r.seat);

    const availability = [];

    for (let seat = 1; seat <= lab.seats; seat++) {

        const reservation = reservations.find(r => r.seat === seat);

        if(!reservation) {
            availability.push({
                seat,
                available: true
            });
        } else {
            const user = Users.getbyId(reservation.userId);

            availability.push({
                seat,
                available: false,
                anonymous: reservation.anonymous,
                userId: reservation.userId,
                userName : user ? user.name : "Unknown User."
            });
        }
    }

    res.json(availability);
});

module.exports = router;