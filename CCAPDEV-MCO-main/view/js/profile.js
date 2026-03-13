document.addEventListener("DOMContentLoaded", async () => {

    const loggedUser =
        JSON.parse(localStorage.getItem('loggedInUser')) ||
        JSON.parse(sessionStorage.getItem('loggedInUser'));

    if(!loggedUser){
        window.location.href = "login.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id") || loggedUser.id;

    //Load profile
    const userRes = await fetch(`/users/${userId}`);
    const user = await userRes.json();

    document.getElementById("profileName").textContent = user.name;

    document.getElementById("profileDesc").textContent =
        user.description || "No description yet.";

    document.getElementById("profilePic").src =
        user.profilePic || "images/blank_pfp.jpg";

    document.getElementById("editDescription").value =
        user.description || "";

    document.getElementById("editProfilePic").value =
        user.profilePic || "";    


    //Load user reservations
    const resRes = await fetch(`/users/${userId}/reservations`);
    const reservations = await resRes.json();

    const list = document.getElementById("reservationList");
    list.innerHTML = "";

    reservations.forEach(r=>{
        const li = document.createElement("li");
        li.textContent =
            `Lab ${r.labId} – Seat ${r.seat} – ${r.date} ${r.time}`;
        list.appendChild(li);
    });

    //form
    document.getElementById("editProfileForm")
    .addEventListener("submit", async function(e){
        
        e.preventDefault();
    
        const description = document.getElementById("editDescription").value;
    
        const profilePic = document.getElementById("editProfilePic").value;
    
        const userId = loggedUser.id;
        
        const response = await fetch(`/users/${loggedUser.id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({description,profilePic})
        });
    
        const data = await response.json();
    
        if (localStorage.getItem("loggedInUser")) {
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        } else {
            sessionStorage.setItem("loggedInUser", JSON.stringify(data.user));
        }
    
        closeEditModal();
        location.reload();
    });

    //edit n delete button
    if(userId == loggedUser.id) {
        document.getElementById("editSection").innerHTML =
        `<button onclick="openEditModal()">Edit Profile</button>
        <button onclick="deleteAccount()">Delete Account</button>`;
    }

});


//Edit profile
function openEditModal(){
    document.getElementById("editProfileModal").style.display="block";
}

function closeEditModal(){
    document.getElementById("editProfileModal").style.display="none";
}





//Delete acc
async function deleteAccount(){

    if(!confirm("Delete account permanently?")) return;

    const loggedUser =
        JSON.parse(localStorage.getItem('loggedInUser')) ||
        JSON.parse(sessionStorage.getItem('loggedInUser'));

    await fetch(`/users/${loggedUser.id}`,{
        method:"DELETE"
    });

    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");

    window.location.href="login.html";
}


//close modal when click outside
window.addEventListener("click", function (event){
    const modal = document.getElementById("editProfileModal");

    if(event.target === modal) {
        closeEditModal();
    }
});