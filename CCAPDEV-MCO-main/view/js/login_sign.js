document.addEventListener("DOMContentLoaded", () => {

    //LOGIN
    const loginform = document.getElementById("loginForm");

    if(loginform) {
        loginform.addEventListener("submit", async function(e) {
            e.preventDefault();
        
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
        
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
        
            const data = await response.json();
        
            if (!data.success) {
                alert(data.message);
                return;
            }
        
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(data.user)
            );
        
            window.location.href = "home.html";
        });
    }


    //SIGNUP
    const signUpForm = document.getElementById("signUpForm");

    if (signUpForm) {
        signUpForm.addEventListener("submit", async function(e){
            e.preventDefault();

            const fName = document.getElementById("fName").value;
            const lName = document.getElementById("lName").value;
            const email = document.getElementById("signemail").value;
            const password = document.getElementById("s_password").value;
            const role = document.querySelector('input[name="role"]:checked')?.value;
            
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fName,
                    lName,
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();

            if(!data.success) {
                alert(data.message);
                return;
            }


            //redirects to home page immediately after signing up successfully
            localStorage.setItem (
                "loggedInUser",
                JSON.stringify(data.user)
            );

            alert("Account created successfully!")
            window.location.href = "home.html";
        });
    }

});