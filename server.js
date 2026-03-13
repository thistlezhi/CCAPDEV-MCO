
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mco_database')
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

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});
