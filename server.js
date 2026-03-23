require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const dbURI = "mongodb://tenshisato69:eighty80*six6@ac-aahfar4-shard-00-00.dxx1rrm.mongodb.net:27017,ac-aahfar4-shard-00-01.dxx1rrm.mongodb.net:27017,ac-aahfar4-shard-00-02.dxx1rrm.mongodb.net:27017/?replicaSet=atlas-92e1xx-shard-0&ssl=true&authSource=admin";



mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Connection error:", err));

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(express.static(path.join(__dirname,'view')));

const authRoutes = require('./controller/authController');
app.use('/', authRoutes);

const reservationRoutes = require('./controller/reservationController');
app.use('/', reservationRoutes);

const userRoutes = require('./controller/userController');
app.use('/', userRoutes);

const technicianRoutes = require('./controller/technicianController');
app.use('/', technicianRoutes);

const labRoutes = require('./controller/labController');
app.use('/', labRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

//IMPORTANT: Only start the server if NOT running on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;