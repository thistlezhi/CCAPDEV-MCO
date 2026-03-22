const tableBody = document.querySelector("#techTable tbody")

const editModal = document.getElementById("editModal")
const walkinModal = document.getElementById("walkinModal")

const editForm = document.getElementById("editForm")
const walkinForm = document.getElementById("walkinForm")

let currentReservationId = null


//LOAD RESERVATION

async function loadReservations(){

  const res = await fetch("/reservations")
  const reservations = await res.json()

  tableBody.innerHTML = ""

  reservations.forEach(r=>{

    const tr = document.createElement("tr")

    const user = r.anonymous ? "Anonymous" : (r.userId?.name || "Unknown")
    const lab = r.labId?.name || "Unknown"

    tr.innerHTML = `
      <td>${user}</td>
      <td>${lab}</td>
      <td>${r.seat}</td>
      <td>${r.date}</td>
      <td>${r.time}</td>
      <td>${new Date(r.dateRequested).toLocaleString()}</td>
      <td>
        <button onclick="openEdit('${r._id}')">Edit</button>
        <button onclick="removeReservation('${r._id}')">Remove</button>
      </td>
    `

    tableBody.appendChild(tr)

  })

}


//EDIT RESeRVATION

async function openEdit(id){

  const res = await fetch(`/reservations/${id}`)
  const r = await res.json()

  currentReservationId = id

  document.getElementById("editUser").value =
    r.anonymous ? "Anonymous" : r.userId.name

  document.getElementById("editLab").value = r.labId._id
  document.getElementById("editDate").value = r.date
  document.getElementById("editTime").value = r.time
  document.getElementById("editSeat").value = r.seat

  editModal.style.display = "block"

}


editForm.addEventListener("submit", async e=>{

  e.preventDefault()

  const labId = document.getElementById("editLab").value
  const date = document.getElementById("editDate").value
  const time = document.getElementById("editTime").value
  const seat = document.getElementById("editSeat").value

  const res = await fetch(`/reservations/${currentReservationId}`,{

    method:"PUT",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      labId,
      date,
      time,
      seat
    })

  })

  if(!res.ok){
    alert("Failed to update reservation")
    return
  }

  editModal.style.display = "none"
  loadReservations()

})


//DELETE RESERVATION

async function removeReservation(id){

  if(!confirm("Remove reservation?")) return

  await fetch(`/reservations/${id}`,{
    method:"DELETE"
  })

  loadReservations()

}


//LOAD LABS

async function loadLabs(){

  const res = await fetch("/labs")
  const labs = await res.json()

  const editLab = document.getElementById("editLab")
  const walkinLab = document.getElementById("walkinLab")

  editLab.innerHTML = ""
  walkinLab.innerHTML = ""

  labs.forEach(lab=>{

    const opt1 = document.createElement("option")
    opt1.value = lab.id
    opt1.textContent = lab.name
    editLab.appendChild(opt1)

    const opt2 = document.createElement("option")
    opt2.value = lab.id
    opt2.textContent = lab.name
    walkinLab.appendChild(opt2)

  })

}


//LOAD STUDS

async function loadStudents(){

  const res = await fetch("/users")
  let users = await res.json()

  // handle different backend formats
  if(users.users) users = users.users

  const sel = document.getElementById("walkinStudent")
  sel.innerHTML = ""

  users
  .filter(u => u.role === "student")
  .forEach(u => {

    const opt = document.createElement("option")

    const name = u.name || u.username || u.email

    opt.value = u.email
    opt.textContent = `${name} (${u.email})`

    sel.appendChild(opt)

  })

}


//LOAD TIME SLOTS

function loadTimeSlots(){

  const walkinTime = document.getElementById("walkinTime")
  const editTime = document.getElementById("editTime")

  if(walkinTime) walkinTime.innerHTML = ""
  if(editTime) editTime.innerHTML = ""

  let start = 7 * 60
  let end = 21 * 60 + 30

  for(let t = start; t <= end; t += 30){

    const hours = Math.floor(t / 60)
    const minutes = t % 60

    const hh = String(hours).padStart(2,'0')
    const mm = String(minutes).padStart(2,'0')

    const value = `${hh}:${mm}`

    if(walkinTime){
      const opt = document.createElement("option")
      opt.value = value
      opt.textContent = value
      walkinTime.appendChild(opt)
    }

    if(editTime){
      const opt = document.createElement("option")
      opt.value = value
      opt.textContent = value
      editTime.appendChild(opt)
    }

  }

}


//7-DAY RESTRICTION

function limitDates(){

  const dateInput = document.getElementById("walkinDate")
  const editDate = document.getElementById("editDate")

  const today = new Date()

  const min = today.toISOString().split("T")[0]

  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + 7)

  const max = maxDate.toISOString().split("T")[0]

  if(walkinDate){
    walkinDate.min = min
    walkinDate.max = max
    walkinDate.value = min
  }

  if(editDate){
    editDate.min = min
    editDate.max = max
  }

}


//WALK IN RESERVATION

walkinForm.addEventListener("submit", async e=>{

  e.preventDefault()

  const email = document.getElementById("walkinStudent").value
  const labId = document.getElementById("walkinLab").value
  const date = document.getElementById("walkinDate").value
  const time = document.getElementById("walkinTime").value
  const seat = document.getElementById("walkinSeat").value

  const res = await fetch("/tech/walk-in",{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      email,
      labId,
      seat,
      date,
      time
    })

  })

  const data = await res.json()

  if(!res.ok){
    alert(data.message)
    return
  }

  walkinModal.style.display="none"
  loadReservations()

})


//MODALS

document.getElementById("walkinBtn").onclick=()=>{
  walkinModal.style.display="block"
}

document.getElementById("closeEdit").onclick=()=>{
  editModal.style.display="none"
}

document.getElementById("cancelEdit").onclick=()=>{
  editModal.style.display="none"
}

document.getElementById("closeWalkin").onclick=()=>{
  walkinModal.style.display="none"
}

document.getElementById("cancelWalkin").onclick=()=>{
  walkinModal.style.display="none"
}




loadLabs()
loadStudents()
loadTimeSlots()
limitDates()
loadReservations()
