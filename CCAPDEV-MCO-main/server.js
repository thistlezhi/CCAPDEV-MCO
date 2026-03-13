
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'view')));

const authRoutes = require('./controller/authController');
app.use('/', authRoutes);

const reservationRoutes = require('./controller/reservationController');
app.use('/', reservationRoutes);

const userRoutes = require('./controller/userController');
app.use('/', userRoutes);

const labRoutes = require('./controller/labController');
app.use('/', labRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});