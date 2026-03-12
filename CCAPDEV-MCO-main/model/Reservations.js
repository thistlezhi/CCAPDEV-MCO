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

/*
exports.getAll = () => reservations;

exports.getById = (id) =>
  reservations.find(r => r.id === parseInt(id));

exports.add = (reservation) => {
  reservations.push(reservation);
};

exports.update = (id, updatedData) => {
  const index = reservations.findIndex(r => r.id === parseInt(id));
  if (index !== -1) {
    reservations[index] = { ...reservations[index], ...updatedData };
  }
};

exports.delete = (id) => {
  reservations = reservations.filter(r => r.id !== parseInt(id));
};

exports.deleteByUser = (userId) => {
    reservations = reservations.filter(r => r.userId !== parseInt(userId));
};*/
