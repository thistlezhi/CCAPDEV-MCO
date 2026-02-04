//LOGIN FUNCTIONS
const loginform = document.getElementById('loginForm');
//Checks if login form exists
if(loginForm){
  loginForm.addEventListener( 'submit', function(event){
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    //1. Find the user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);

    if(user){
        //Handles when users check "Remember Me"
        if(rememberMe){
            //Calculates 3 weeks in milliseconds
            const threeWeeks = 21 * 24 * 60 * 60 * 1000; // 21 days in milliseconds
            //Sets expiry date to current time + 3 weeks
            const expiryDate = new Date(Date.now()+threeWeeks);
            //Stores user data and expiry date in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            localStorage.setItem('sessionExpiry', expiryDate.getTime());

        } else{
            //Stores user data in sessionStorage for non-persistent login
            //For Temporary Sessions
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        }
        // Successful login message
        alert('Login successful! Welcome, ' + user.name);
        // Redirect to homepage
        window.location.href = "home.html";
    } else{
        // Invalid credentials message
        alert('Invalid email or password. Please try again.');
    }
});
}

//SIGNUP FUNCTIONS
const signupForm = document.getElementById('signUpForm');
//Checks if signup form exists
if(signupForm){
signupForm.addEventListener('submit', function(event){
    event.preventDefault();
    //Gets values from the signup form
    const fName = document.getElementById('fName').value.trim();
    const lName = document.getElementById('lName').value.trim();
    const signEmail = document.getElementById('signemail').value.trim();
    const s_password = document.getElementById('s_password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    //Validates DLSU email
    if (!signEmail.endsWith('@dlsu.edu.ph')) {
        alert('Please use a valid DLSU email address.');
        return;
    }
    //Checks if email is already registered
    const existingUser = users.find(u => u.email === signEmail);

    if(existingUser){
        // Email already registered message
        alert('Email already registered. Please use a different email.');
        return;
    }
    //Creates new user object and adds it to the users array
    const newUser = {
        id: users.length + 1,
        name: `${fName} ${lName}`,
        email: signEmail,
        password: s_password,
        role: role
    };
    //Saves the updated users array to localStorage
    users.push(newUser);
    saveUsers();

    alert('Signup successful! You can now log in.');
    window.location.href = 'login.html';
    console.log(users);
});
}
//LOGOUT FUNCTION
function logout(){
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('sessionExpiry');
    sessionStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    window.location.href = 'login.html';
}

//EXTEND EXPIRY FUNCTION
function checkAndExtendSession() {
    const user = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    const expiry = localStorage.getItem('sessionExpiry');

    // If there's no user logged in and we aren't on login/signup, redirect to login
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');
    
    if (!user && !isAuthPage) {
        window.location.href = 'login.html';
        return;
    }

    // If "Remember Me" is active, check expiry and extend
    if (expiry) {
        if (Date.now() > parseInt(expiry)) {
            alert("Session expired.");
            logout();
        } else {
            // Extension: Every visit adds 3 weeks from RIGHT NOW
            const threeWeeks = 21 * 24 * 60 * 60 * 1000;
            localStorage.setItem('sessionExpiry', Date.now() + threeWeeks);
            console.log("Session extended by visit.");
        }
    }
}

// RUN THIS ON EVERY PAGE LOAD
checkAndExtendSession();
