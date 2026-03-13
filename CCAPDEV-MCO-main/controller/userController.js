const express = require('express');
const router = express.Router();

const Users = require('../model/Users');
const Reservations = require('../model/Reservations');


//GET USER
router.get('/users/:id', (req, res) => {
    const user = Users.getUsers()
    .find(u => u.id === parseInt(req.params.id));

    if (!user){
        return res.status(404).json({message: "User not found."});
    }

    res.json(user);
});


//UPDATE PROFILE
router.put('/users/:id', (req,res)=> {
    const user = Users.getUsers()
    .find(u => u.id === parseInt(req.params.id));

    if(!user) {
        return res.status(404).json({ message: "User not found."});
    }

    user.description = req.body.description;
    user.profilePic = req.body.profilePic;

    res.json({
        success: true,
        user
    });
});


//DELETE ACC
router.delete('/users/:id',(req,res)=> {
    Users.deleteUser(req.params.id);
    Reservations.deleteByUser(req.params.id);

    res.json({success:true});
});


//GET RESERVATIONS OF USERS
router.get('/users/:id/reservations',(req,res)=> {
    const userReservations =
        Reservations.getAll()
        .filter(r => r.userId === parseInt(req.params.id));

    res.json(userReservations);
})

module.exports = router;