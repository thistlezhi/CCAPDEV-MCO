// RESERVATIONS

let reservations = [
  {
    id: 1,
    userId: 2,
    labId: 1,
    seat: 3,
    date: "2026-03-15",
    time: "09:00",
    anonymous: false,
    dateRequested: "2026-01-28 14:32"
  },
  {
    id: 2,
    userId: 1,
    labId: 2,
    seat: 1,
    date: "2026-03-14",
    time: "10:00",
    anonymous: true,
    dateRequested: "2026-01-28 15:02"
  },
  {
    id: 3,
    userId: 4,
    labId: 3,
    seat: 9,
    date: "2026-03-17",
    time: "11:00",
    anonymous: false,
    dateRequested: "2026-02-10 13:00"
  },
  {
    id: 4,
    userId: 3,
    labId: 4,
    seat: 2,
    date: "2026-03-15",
    time: "10:30",
    anonymous: false,
    dateRequested: "2026-02-08 17:34"
  },
  {
    id: 5,
    userId: 1,
    labId: 3,
    seat: 5,
    date: "2026-03-16",
    time: "11:00",
    anonymous: false,
    dateRequested: "2026-02-11 14:50"
  }
];

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
};