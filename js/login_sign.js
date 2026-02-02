//LOGIN FUNCTIONS
const form = document.getElementById('loginForm');
form.addEventListener( 'submit', function(event){
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const user = users.find(u => u.email === email && u.password === password);

    if(user){
        alert('Login successful! Welcome, ' + user.name);
        // Redirect to homepage
        window.location.href = "home.html";
    } else{
        alert('Invalid email or password. Please try again.');
    }
});

//SIGNUP FUNCTIONS
const signupForm = document.getElementById('signUpForm');
signupForm.addEventListener('submit', function(event){
    event.preventDefault();
    
    const fName = document.getElementById('fName').value.trim();
    const lName = document.getElementById('lName').value.trim();
    const signEmail = document.getElementById('signemail').value.trim();
    const s_password = document.getElementById('s_password').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    const existingUser = users.find(u => u.email === signEmail);

    if(existingUser){
        alert('Email already registered. Please use a different email.');
        return;
    }
    const newUser = {
        id: users.length + 1,
        name: `${fName} ${lName}`,
        email: signEmail,
        password: s_password,
        role: role
    };

    users.push(newUser);
    alert('Signup successful! You can now log in.');
    window.location.href = 'login.html';
    console.log(users);
});