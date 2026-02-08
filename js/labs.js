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

  if (!lab) return; //prevent crash if nothing selected

  for (let hour = 9; hour <= 17; hour++) {
    ["00", "30"].forEach(min => {

      const time = `${hour.toString().padStart(2, '0')}:${min}`;

      for (let seat = 1; seat <= lab.seats; seat++) {
        const reservation = reservations.find(r =>
          r.labId === selectedLab &&
          r.date === date &&
          r.time === time &&
          r.seat === seat
        );

        const row = table.insertRow();
        row.insertCell().textContent = time;
        row.insertCell().textContent = seat;

        const statusCell = row.insertCell();

        if (reservation) {
          const user = users.find(u => u.id === reservation.userId);

          if(reservation.anonymous){
            statusCell.textContent = "Reserved (Anonymous)";
          } else {
            const link = document.createElement("a");
            link.href = `profile.html?id=${user.id}`;
            link.textContent = `Reserved by ${user.name}`;
            statusCell.appendChild(link);
          }
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
