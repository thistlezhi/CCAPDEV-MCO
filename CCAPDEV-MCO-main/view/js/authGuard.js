
document.addEventListener("DOMContentLoaded", () => {

    const user =
        JSON.parse(localStorage.getItem("loggedInUser")) ||
        JSON.parse(sessionStorage.getItem("loggedInUser"));

    // not logged in
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    //role-based access

    const page = window.location.pathname;

    //students only
    if (page.includes("reserve.html") && user.role !== "student") {
        window.location.href = "technician.html";
        return;
    }

    //technicians only
    if (page.includes("technician.html") && user.role !== "technician") {
        window.location.href = "home.html";
        return;
    }


    const techLink = document.getElementById("techLink");
    const reserveLink = document.getElementById("reserveLink");
    const reservationsLink = document.getElementById("myReservationsLink");

    if (user.role === "technician") {

        if (techLink) techLink.style.display = "inline";
        if (reserveLink) reserveLink.style.display = "none";
        if (reservationsLink) reservationsLink.style.display = "none";

    } else {

        if (techLink) techLink.style.display = "none";
    }

});