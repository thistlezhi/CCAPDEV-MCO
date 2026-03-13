

// Restricted technician.html to technicians only and restricted reserve slots n my reservations to students only

document.addEventListener("DOMContentLoaded", () => {

    const loggedUser =
        JSON.parse(localStorage.getItem('loggedInUser')) ||
        JSON.parse(sessionStorage.getItem('loggedInUser'));

    if(!loggedUser) {
        window.location.href = "login.html";
        return;
    }

    if (loggedUser && loggedUser.role === "technician") {
        document.getElementById("techLink").style.display = "inline";

        const resLink = document.getElementById("ReservationsLink");
        if (resLink) {
            resLink.style.display = "none";
        }
    }
});

function logout() {
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    
    window.location.href = "login.html";
}
