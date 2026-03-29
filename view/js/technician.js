const tableBody = document.querySelector("#techTable tbody")

const editModal = document.getElementById("editModal")
const walkinModal = document.getElementById("walkinModal")

const editForm = document.getElementById("editForm")
const walkinForm = document.getElementById("walkinForm")

const walkinStudentInput = document.getElementById("walkinStudentSearch")
const walkinStudentValue = document.getElementById("walkinStudent")
const walkinStudentResults = document.getElementById("walkinStudentResults")
const walkinStudentSelected = document.getElementById("walkinStudentSelected")

let currentReservationId = null
let students = []


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

  students = users
    .filter(u => u.role === "student")
    .map(u => ({
      name: u.name || u.username || u.email,
      email: u.email
    }))

  walkinStudentResults.classList.remove("is-open")

}

function renderStudentMatches(query){

  const normalizedQuery = query.trim().toLowerCase()

  const matches = students
    .filter(student => {
      if(!normalizedQuery) return true

      return (
        student.name.toLowerCase().includes(normalizedQuery) ||
        student.email.toLowerCase().includes(normalizedQuery)
      )
    })
    .slice(0, 8)

  walkinStudentResults.innerHTML = ""

  if(matches.length === 0){
    const empty = document.createElement("div")
    empty.className = "student-result-empty"
    empty.textContent = "No matching students found."
    walkinStudentResults.appendChild(empty)
    walkinStudentResults.classList.add("is-open")
    return
  }

  matches.forEach(student => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "student-result"
    button.textContent = `${student.name} (${student.email})`
    button.addEventListener("click", () => selectStudent(student))
    walkinStudentResults.appendChild(button)
  })

  walkinStudentResults.classList.add("is-open")

}

function selectStudent(student){
  walkinStudentInput.value = `${student.name} (${student.email})`
  walkinStudentValue.value = student.email
  walkinStudentSelected.textContent = `Selected student: ${student.name}`
  walkinStudentSelected.hidden = false
  walkinStudentResults.classList.remove("is-open")
}

function clearStudentSelection(){
  walkinStudentValue.value = ""
  walkinStudentSelected.hidden = true
  walkinStudentSelected.textContent = ""
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

  if(dateInput){
    dateInput.min = min
    dateInput.max = max
    dateInput.value = min
  }

  if(editDate){
    editDate.min = min
    editDate.max = max
  }

}


//WALK IN RESERVATION

walkinForm.addEventListener("submit", async e=>{

  e.preventDefault()

  const email = walkinStudentValue.value
  const labId = document.getElementById("walkinLab").value
  const date = document.getElementById("walkinDate").value
  const time = document.getElementById("walkinTime").value
  const seat = document.getElementById("walkinSeat").value

  if(!email){
    alert("Please select a student from the search results.")
    return
  }

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
  walkinForm.reset()
  clearStudentSelection()
  limitDates()
  walkinStudentResults.classList.remove("is-open")
  loadReservations()

})


//MODALS

walkinStudentInput.addEventListener("input", e => {
  clearStudentSelection()
  renderStudentMatches(e.target.value)
})

walkinStudentInput.addEventListener("focus", () => {
  renderStudentMatches(walkinStudentInput.value)
})

document.addEventListener("click", e => {
  if(!e.target.closest(".student-search")){
    walkinStudentResults.classList.remove("is-open")
  }
})

document.getElementById("walkinBtn").onclick=()=>{
  walkinForm.reset()
  clearStudentSelection()
  limitDates()
  walkinStudentResults.classList.remove("is-open")
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
