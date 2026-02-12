
// USERS
let users = JSON.parse(localStorage.getItem('users')) || [
  { id: 1, name: "Thistle Caindoy", email: "thistle_zhi_caindoy@dlsu.edu.ph",password:"thisle123", role: "student" },
  { id: 2, name: "Luis Carlos", email: "luis_carlos@dlsu.edu.ph", password:"luis123", role: "student" },
  { id: 3, name: "Ramuel Cordero", email: "ramuel_cordero@dlsu.edu.ph", password:"ram123", role: "student" },
  { id: 4, name: "Alberto Descalzo", email: "alberto_descalzo@dlsu.edu.ph", password:"albert123", role: "student" },
  { id: 5, name: "Danny Cheng", email: "danny.cheng@dlsu.edu.ph", password:"dan123", role: "technician" }
];

// Helper function to save users to localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// LABS
const labs = [
  { id: 1, name: "Gokongwei Lab", seats: 10 },
  { id: 2, name: "Velasco Lab", seats: 8 },
  { id: 3, name: "Andrew Lab", seats: 12 },
  { id: 4, name: "St. La Salle Lab", seats: 15 }
];

// RESERVATIONS

//let reservations = JSON.parse(localStorage.getItem('reservations')) || [

//localStorage.removeItem('reservations');
let reservations = JSON.parse(localStorage.getItem('reservations'));

if (!reservations || reservations.length === 0) {
  reservations = [
  {
    id: 1,
    userId: 2,
    labId: 1,
    seat: 3,
    date: "2026-02-15",
    time: "09:00",
    anonymous: false,
    dateRequested: "2026-01-28 14:32"
  },
  {
    id: 2,
    userId: 1,
    labId: 2,
    seat: 1,
    date: "2026-02-14",
    time: "10:00",
    anonymous: true,
    dateRequested: "2026-01-28 15:02"
  }
  ];

  localStorage.setItem('reservations', JSON.stringify(reservations));
}

function saveReservations() {
  localStorage.setItem('reservations', JSON.stringify(reservations));
}

// function saveReservations() {
//   localStorage.setItem('reservations', JSON.stringify(reservations));

//localStorage.setItem('reservations', JSON.stringify(reservations));

