const express = require('express');
const router = express.Router();
const Reservation = require('../model/Reservations');
const User = require('../model/Users');

router.post('/tech/walk-in', async (req, res) => {
    try {
        const { email, labId, seat, date, time } = req.body;

        // 1. Find student
        const student = await User.findOne({ email, role: 'student' });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }

        //Validate slot
        const existing = await Reservation.findOne({
            labId,
            seat,
            date,
            time
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Slot already reserved."
            });
        }

        // 2. Create reservation using student._id
        const newRes = await Reservation.create({
            userId: student._id,
            labId,
            seat,
            date,
            time,
            anonymous: false // Walk-ins are never anonymous
        });

        res.status(201).json({ success: true, reservation: newRes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
