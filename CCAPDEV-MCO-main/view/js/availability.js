document.addEventListener("DOMContentLoaded", async () => {

    const labSelect = document.getElementById("labSelect");
    const dateSelect = document.getElementById("dateSelect");
    const timeSelect = document.getElementById("timeSelect");

    const table = document.getElementById("slotsTable");

    // Load labs
    const labsRes = await fetch("/labs");
    const labs = await labsRes.json();

    labs.forEach(lab => {
        const opt = document.createElement("option");
        opt.value = lab.id;
        opt.textContent = lab.name;
        labSelect.appendChild(opt);
    });

    generateTimeOptions();

    labSelect.addEventListener("change", loadAvailability);
    dateSelect.addEventListener("change", loadAvailability);
    timeSelect.addEventListener("change", loadAvailability);


    async function loadAvailability() {

        const labId = labSelect.value;
        const date = dateSelect.value;
        const time = timeSelect.value;

        if (!labId || !date || !time) return;

        const res = await fetch(
            `/labs/${labId}/availability?date=${date}&time=${time}`
        );

        const seats = await res.json();

        table.innerHTML =
            `<tr>
                <th>Time</th>
                <th>Seat</th>
                <th>Status</th>
            </tr>`;

        seats.forEach(s => {

            const row = table.insertRow();

            row.insertCell().textContent = time;
            row.insertCell().textContent = s.seat;
            
            const statusCell = row.insertCell();

            if(s.available) {
                statusCell.textContent = "Available";
            } else if (s.anonymous) {
                statusCell.textContent = "Reserved anonymously";
            } else {
                statusCell.innerHTML = `Reserved by <a href = "profile.html?id=${s.userId}">${s.userName}</a>`
            }
        });
    }


    function generateTimeOptions() {
        for (let hour = 7; hour <= 21; hour++) {
            ["00", "30"].forEach(min => {
                const time = `${String(hour).padStart(2,"0")}:${min}`;
                const opt = document.createElement("option");
                opt.value = time;
                opt.textContent = time;
                timeSelect.appendChild(opt);
            });
        }
    }

});