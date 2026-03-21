// RESERVATIONS

const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  seat: { type: Number, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:mm
  anonymous: { type: Boolean, default: false },
  dateRequested: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);
