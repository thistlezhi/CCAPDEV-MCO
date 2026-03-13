const express = require('express');
const router = express.Router();

const Reservations = require('../model/Reservations');

// GET all reservations
router.get('/reservations', (req, res) => {
    res.json(Reservations.getAll());
});

// GET one reservation
router.get('/reservations/:id', (req, res) => {
    const reservation = Reservations.getById(req.params.id);

    if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
});

// CREATE reservation
router.post('/reservations', (req, res) => {

    const { userId, labId, seat, date, time, anonymous } = req.body;

    //check if seat is taken

    const existing = Reservations.getAll().find (r =>
        r.labId == labId &&
        r.seat == seat &&
        r.date == date &&
        r.time == time
    );

    if(existing) {
        return res.json({
            success: false,
            message: "Slot already reserved."
        });
    }


    const newReservation = {
        id: Date.now(),
        userId,
        labId,
        seat,
        date,
        time,
        anonymous,
        dateRequested: new Date().toISOString()
    };

    Reservations.add(newReservation);

    res.json({
        success: true,
        reservation: newReservation
    });
});

// UPDATE reservation
router.put('/reservations/:id', (req, res) => {
    Reservations.update(req.params.id, req.body);
    res.json({ success: true });
});

// DELETE reservation
router.delete('/reservations/:id', (req, res) => {
    Reservations.delete(req.params.id);
    res.json({ success: true });
});

module.exports = router;