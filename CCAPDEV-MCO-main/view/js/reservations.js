document.addEventListener("DOMContentLoaded", async () => {

    const loggedUser =
        JSON.parse(localStorage.getItem("loggedInUser")) ||
        JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedUser) {
        window.location.href = "login.html";
        return;
    }

    const table = document.getElementById("resTable");
    const labSelect = document.getElementById("labSelect");
    const dateInput = document.getElementById("dateSelect"); 
    const seatSelect = document.getElementById("seatSelect");
    const timeSelect = document.getElementById("timeSelect");

    //Load labs
    const labRes = await fetch("/labs");
    const labs = await labRes.json();

    labs.forEach(lab => {
        const option = document.createElement("option");
        option.value = lab.id;
        option.textContent = lab.name;
        labSelect.appendChild(option);
    });


    //7-day limit
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7);

    dateInput.min = minDate;
    dateInput.max = maxDate.toISOString().split("T")[0];
    dateInput.value = minDate;

    
    //time options
    function generateTimeOptions(){
        timeSelect.innerHTML = "";

        for(let hour = 7; hour <= 21; hour++) {
            ["00", "30"].forEach(min => {
                const time = `${String(hour).padStart(2,"0")}:${min}`;
                const opt = document.createElement("option");
                opt.value = time;
                opt.textContent = time;
                timeSelect.appendChild(opt);
            });
        }
    }

    generateTimeOptions();


    //load reservations
    async function loadReservations() {

        const res = await fetch("/reservations");
        const reservations = await res.json();

        table.innerHTML = `
            <tr>
                <th>Lab</th>
                <th>Seat</th>
                <th>Date</th>
                <th>Time</th>
                <th>Date Requested</th>
                <th>Actions</th>
            </tr>
        `;

        reservations
        .filter(r => r.userId === loggedUser.id)
        .forEach(r => {

            const lab = labs.find(l => l.id == r.labId);

            const row = table.insertRow();

            row.insertCell().textContent = lab.name;
            row.insertCell().textContent = r.seat;
            row.insertCell().textContent = r.date;
            row.insertCell().textContent = r.time;

            const formatted = new Date(r.dateRequested).toLocaleString();
            row.insertCell().textContent = r.dateRequested;

            row.insertCell().innerHTML =
                `
                <button onclick="openEditModal(${r.id})">Edit</button>
                <button onclick="deleteReservation(${r.id})">Cancel</button>
                `;
        });
    }

    await loadReservations();
    await loadAvailableSeats();


    //load available seats
    async function loadAvailableSeats() {
        
        const labId = labSelect.value;
        const date = dateInput.value;
        const time = timeSelect.value;

        if(!labId || !date || !time) return;

        const res = await fetch (`/labs/${labId}/availability?date=${date}&time=${time}`);

        const seats = await res.json();
        seatSelect.innerHTML = "";

        const availableSeats = seats.filter(s => s.available);

        if(availableSeats.length === 0){
            const opt = document.createElement("option");
            opt.textContent = "No seats available.";
            seatSelect.appendChild(opt);
            return;
        }

        availableSeats.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.seat;
            opt.textContent = `Seat ${s.seat}`;

            seatSelect.appendChild(opt);
        });
    }

    labSelect.addEventListener("change", loadAvailableSeats);
    dateInput.addEventListener("change", loadAvailableSeats);
    timeSelect.addEventListener("change", loadAvailableSeats);


    // create reservation
    document.getElementById("confirmButton")
    .addEventListener("click", async () => {

        const body = {
            userId: loggedUser.id,
            labId: Number(labSelect.value),
            seat: Number(seatSelect.value),
            date: dateInput.value,
            time: timeSelect.value,
            anonymous: document.getElementById("anonymous").checked
        };

        const response = await fetch("/reservations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!data.success) {
            alert(data.message);
            return;
        }

        await loadReservations();
        await loadAvailableSeats();
    });

});


//edit reservation
async function saveEditReservation(id, body) {
    await fetch(`/reservations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    
    location.reload();
}


//delete reservation
async function deleteReservation(id) {

    if (!confirm("Cancel reservation?")) return;

    await fetch(`/reservations/${id}`, {
        method: "DELETE"
    });

    location.reload();
}