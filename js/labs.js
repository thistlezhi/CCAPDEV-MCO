const labSelect = document.getElementById("labSelect");
const dateSelect = document.getElementById("dateSelect");
const table = document.getElementById("slotsTable");

labs.forEach(lab => {
  const option = document.createElement("option");
  option.value = lab.id;
  option.textContent = lab.name;
  labSelect.appendChild(option);
});

dateSelect.valueAsDate = new Date();

function renderSlots() {
  table.innerHTML = `
    <tr>
      <th>Time</th>
      <th>Seat</th>
      <th>Status</th>
    </tr>
  `;

  const selectedLab = Number(labSelect.value);
  const date = dateSelect.value;
  const lab = labs.find(l => l.id === selectedLab);

  for (let hour = 9; hour <= 17; hour++) {
    ["00", "30"].forEach(min => {
      for (let seat = 1; seat <= lab.seats; seat++) {
        const time = `${hour}:${min}`;
        const reservation = reservations.find(r =>
          r.labId === selectedLab &&
          r.date === date &&
          r.time === time &&
          r.seat === seat
        );

        const row = table.insertRow();
        row.insertCell().textContent = time;
        row.insertCell().textContent = seat;

        if (reservation) {
          const user = users.find(u => u.id === reservation.userId);
          row.insertCell().textContent =
            reservation.anonymous ? "Reserved (Anonymous)" : `Reserved by ${user.name}`;
        } else {
          row.insertCell().textContent = "Available";
        }
      }
    });
  }
}

labSelect.addEventListener("change", renderSlots);
dateSelect.addEventListener("change", renderSlots);
renderSlots();

setInterval(renderSlots, 5000);
