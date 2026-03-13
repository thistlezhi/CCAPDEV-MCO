const mongoose = require('mongoose');
const User = require('./model/Users'); 
const Lab = require('./model/Labs');
const Reservation = require('./model/Reservations');

const dbURI = 'mongodb://127.0.0.1:27017/mco_database';

const seedData = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to MongoDB for seeding...");

        // 1. Clear existing data to avoid duplicates
        await User.deleteMany({});
        await Lab.deleteMany({});
        await Reservation.deleteMany({});

        // 2. Insert Users
        let users = [
            { name: "Thistle Caindoy", email: "thistle_zhi_caindoy@dlsu.edu.ph",password:"thisle123", role: "student", description: "I am a BSMS - Computer Science Student." },
            { name: "Luis Carlos", email: "luis_carlos@dlsu.edu.ph", password:"luis123", role: "student", description: "Computer Science student who loves coding." },
            { name: "Ramuel Cordero", email: "ramuel_cordero@dlsu.edu.ph", password:"ram123", role: "student", description: "I enjoy working with css!" },
            { name: "Alberto Descalzo", email: "alberto_descalzo@dlsu.edu.ph", password:"albert123", role: "student", description: "I prefer quiet computer laboratories." },
            { name: "Danny Cheng", email: "danny.cheng@dlsu.edu.ph", password:"dan123", role: "technician", description: "Lab technician assisting students." }
            ];
        const createdUsers = await User.insertMany(users);
        console.log("Users seeded!");

        // 3. Insert Labs
        const labs = [
            { name: "Gokongwei Lab", totalSeats: 10 }, 
            { name: "Velasco Lab", totalSeats: 8 },
            { name: "Andrew Lab", totalSeats: 12 },
            { name: "St. La Salle Lab", totalSeats: 15 }
        ];
        const createdLabs = await Lab.insertMany(labs);
        console.log("Labs seeded!");
        
        // 4. Insert Reservations
        const reservations = [
            {
                userId: createdUsers[1]._id, // Luis Carlos
                labId: createdLabs[0]._id, // Gokongwei Lab
                seat: 3,
                date: "2026-03-15",
                time: "09:00",
                anonymous: false,
                dateRequested: "2026-01-28 14:32"
            },
            {
                userId: createdUsers[0]._id, // Thistle Caindoy
                labId: createdLabs[1]._id, // Velasco Lab
                seat: 1,
                date: "2026-03-14",
                time: "10:00",
                anonymous: true,
                dateRequested: "2026-01-28 15:02"
            },
            {
                userId: createdUsers[3]._id, // Alberto Descalzo
                labId: createdLabs[2]._id, // Andrew Lab
                seat: 9,
                date: "2026-03-17",
                time: "11:00",
                anonymous: false,
                dateRequested: "2026-02-10 13:00"
            },
            {
                userId: createdUsers[2]._id, // Ramuel Cordero
                labId: createdLabs[3]._id, // St. La Salle Lab
                seat: 2,
                date: "2026-03-15",
                time: "10:30",
                anonymous: false,
                dateRequested: "2026-02-08 17:34"
            },
            {
                userId: createdUsers[0]._id, // Thistle Caindoy
                labId: createdLabs[2]._id, // Andrew Lab
                seat: 5,
                date: "2026-03-16",
                time: "11:00",
                anonymous: false,
                dateRequested: "2026-02-11 14:50"
            }
        ];
        const createdReservations = await Reservation.insertMany(reservations);
        console.log("Reservations seeded!");

        await mongoose.connection.close();
        console.log("Seeding complete. Connection closed.");
    } catch (err) {
        console.error(err);
    }
};

seedData();