const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'view')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.post('/register', (req,res) => {
    const{ fName, lName, signemail, password, role} = req.body;
    let errors = [];

    if (!fName || fName.trim() === '')
        errors.push("First Name is required");

    if (!lName || lName.trim() === '')
        errors.push("Last Name is required");

    if (!signemail ||signemail.trim() === '')
        errors.push("Email is required")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (signemail && !emailRegex.test(signemail))
        errors.push('Invalid email format.');

    if (!password || password.length < 6)
        errors.push('Password must be at least 6 characters.');

    if (!role)
        errors.push('You must choose your role')

    if (errors.length > 0){
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    res.json({
        success: true,
        message: 'Registration successful (server-side validated)'
    })
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});