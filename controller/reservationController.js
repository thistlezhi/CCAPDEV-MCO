const express = require('express');
const router = express.Router();

const Reservation = require('../model/Reservations');


//GET reservations
router.get('/reservations', async (req, res) => {

    try {

        const reservations = await Reservation
            .find()
            .populate("userId")
            .populate("labId");

        res.json(reservations);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});


//GET one reservation
router.get('/reservations/:id', async (req, res) => {

    try {

        const reservation = await Reservation
            .findById(req.params.id)
            .populate("userId")
            .populate("labId");

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.json(reservation);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});


//CREATE reservation
router.post('/reservations', async (req, res) => {

    try {

        const { userId, labId, seat, date, time, anonymous } = req.body;

        // check if seat already reserved
        const existing = await Reservation.findOne({
            labId,
            seat,
            date,
            time
        });

        if (existing) {
            return res.json({
                success: false,
                message: "Slot already reserved."
            });
        }

        const newReservation = await Reservation.create({
            userId,
            labId,
            seat,
            date,
            time,
            anonymous
        });

        res.json({
            success: true,
            reservation: newReservation
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});


//UPDATE reservation
router.put('/reservations/:id', async (req, res) => {

    try {

        const {labId, seat, date, time} = req.body;

        const existing = await Reservation.findOne({
            labId,
            seat,
            date,
            time,
            _id: {$ne: req.params.id} //ignore current reservation
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Slot already reserved."
            });
        }

        await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});


//DELETE reservation
router.delete('/reservations/:id', async (req, res) => {

    try {

        await Reservation.findByIdAndDelete(req.params.id);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

module.exports = router;
