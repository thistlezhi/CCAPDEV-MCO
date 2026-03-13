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
    const editLabSelect = document.getElementById("editLab"); // Added for Edit Modal
    const dateInput = document.getElementById("dateSelect"); 
    const seatSelect = document.getElementById("seatSelect");
    const timeSelect = document.getElementById("timeSelect");

    // 1. Load labs and populate BOTH dropdowns
    const labRes = await fetch("/labs");
    const labs = await labRes.json();

    labs.forEach(lab => {
        const option = document.createElement("option");
        option.value = lab.id;
        option.textContent = lab.name;
        
        labSelect.appendChild(option.cloneNode(true)); // Main form
        if(editLabSelect) editLabSelect.appendChild(option); // Edit modal
    });

    // 2. Date Limits
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    const maxDateObj = new Date(today);
    maxDateObj.setDate(today.getDate() + 7);
    const maxDate = maxDateObj.toISOString().split("T")[0];

    dateInput.min = minDate;
    dateInput.max = maxDate;
    dateInput.value = minDate;

    const editDateInput = document.getElementById("editDate");
    if (editDateInput) {
        editDateInput.min = minDate;
        editDateInput.max = maxDate;
    }

    // 3. Generate Time Options
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

    // 4. Load Reservations into Table
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
        .filter(r => r.userId._id === loggedUser._id)
        .forEach(r => {
            const labName = r. labId?.name || "Unknown.";
            const row = table.insertRow();
            row.insertCell().textContent = labName;
            row.insertCell().textContent = r.seat;
            row.insertCell().textContent = r.date;
            row.insertCell().textContent = r.time;

            const formattedDate = new Date(r.dateRequested).toLocaleString();
            row.insertCell().textContent = formattedDate;

            row.insertCell().innerHTML = `
                <button onclick="openEditModal('${r._id}')">Edit</button>
                <button onclick="deleteReservation('${r._id}')">Cancel</button>
            `;
        });
    }

    // 5. Load Available Seats
    async function loadAvailableSeats() {
        const labId = labSelect.value;
        const date = dateInput.value;
        const time = timeSelect.value;
        if(!labId || !date || !time) return;

        const res = await fetch(`/labs/${labId}/availability?date=${date}&time=${time}`);
        const seats = await res.json();
        seatSelect.innerHTML = "";
        const availableSeats = seats.filter(s => s.available);

        if(availableSeats.length === 0){
            seatSelect.innerHTML = "<option>No seats available.</option>";
            return;
        }

        availableSeats.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.seat;
            opt.textContent = `Seat ${s.seat}`;
            seatSelect.appendChild(opt);
        });
    }

    // Event Listeners for Availability
    labSelect.addEventListener("change", loadAvailableSeats);
    dateInput.addEventListener("change", loadAvailableSeats);
    timeSelect.addEventListener("change", loadAvailableSeats);

    // 6. Create Reservation
    document.getElementById("confirmButton").addEventListener("click", async () => {
        const body = {
            userId: loggedUser._id,
            labId: labSelect.value,
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

        if (response.ok) {
            await loadReservations();
            await loadAvailableSeats();
        }
    });

    // 7. Edit Form Submission
    document.getElementById("editForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = e.target.dataset.currentId;
        const updatedBody = {
            labId: document.getElementById("editLab").value,
            date: document.getElementById("editDate").value,
            time: document.getElementById("editTime").value,
            seat: Number(document.getElementById("editSeat").value)
        };
        await saveEditReservation(id, updatedBody);
    });

    // Initial load calls
    await loadReservations();
    await loadAvailableSeats();
});

// --- GLOBAL FUNCTIONS (Outside DOMContentLoaded so buttons can find them) ---

window.openEditModal = async function(id) {
    const res = await fetch("/reservations");
    const reservations = await res.json();
    const r = reservations.find(item => item._id === id);

    if (r) {
        document.getElementById("editLab").value = r.labId._id;
        document.getElementById("editDate").value = r.date;
        document.getElementById("editTime").value = r.time;
        document.getElementById("editSeat").value = r.seat;
        document.getElementById("editForm").dataset.currentId = id;
        document.getElementById("editModal").style.display = "block";
    }
};

window.closeEditModal = function() {
    document.getElementById("editModal").style.display = "none";
};

async function saveEditReservation(id, body) {
    await fetch(`/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    location.reload();
}

async function deleteReservation(id) {
    if (!confirm("Cancel reservation?")) return;
    await fetch(`/reservations/${id}`, { method: "DELETE" });
    location.reload();
}
