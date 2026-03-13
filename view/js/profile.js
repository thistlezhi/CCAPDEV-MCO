document.addEventListener("DOMContentLoaded", async () => {

    const loggedUser =
        JSON.parse(localStorage.getItem('loggedInUser')) ||
        JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (!loggedUser) {
        window.location.href = "login.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    // Use ._id instead of .id
    const userId = params.get("id") || loggedUser._id;

    try {
        // Load profile
        const userRes = await fetch(`/users/${userId}`);
        const user = await userRes.json();

        if (userRes.ok) {
            document.getElementById("profileName").textContent = user.name;
            document.getElementById("profileDesc").textContent = user.description || "No description yet.";
            document.getElementById("profilePic").src = user.profilePic || "images/blank_pfp.jpg";
            
            // Populate modal fields
            document.getElementById("editDescription").value = user.description || "";
            document.getElementById("editProfilePic").value = user.profilePic || "";
        }

        // Load user reservations
        const resRes = await fetch(`/users/${userId}/reservations`);
        const reservations = await resRes.json();

        const list = document.getElementById("reservationList");
        list.innerHTML = "";

        if (Array.isArray(reservations)) {
            reservations.forEach(r => {
                const li = document.createElement("li");
                // Note: r.labId might show the MongoDB ID string now
                const labName = r.labId ? r.labId.name : "Unknown Lab";
    
                li.textContent = `${labName} – Seat ${r.seat} – ${r.date} ${r.time}`;
                list.appendChild(li);
            });
        }

    } catch (err) {
        console.error("Error loading profile data:", err);
    }

    // Form submission
    document.getElementById("editProfileForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const description = document.getElementById("editDescription").value;
        const profilePic = document.getElementById("editProfilePic").value;

        // Use loggedUser._id
        const response = await fetch(`/users/${loggedUser._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, profilePic })
        });

        const data = await response.json();

        if (data.success) {
            // Update the stored user object with the new data
            if (localStorage.getItem("loggedInUser")) {
                localStorage.setItem("loggedInUser", JSON.stringify(data.user));
            } else {
                sessionStorage.setItem("loggedInUser", JSON.stringify(data.user));
            }
            closeEditModal();
            location.reload();
        } else {
            alert("Failed to update profile.");
        }
    });

    // Show edit/delete buttons only for the owner
    // Compare userId (from URL) with loggedUser._id
    if (userId === loggedUser._id) {
        const editSection = document.getElementById("editSection");
        if (editSection) {
            editSection.innerHTML = `
                <button onclick="openEditModal()">Edit Profile</button>
                <button onclick="deleteAccount()">Delete Account</button>
            `;
        }
    }
});

// Edit profile modal functions
function openEditModal() {
    document.getElementById("editProfileModal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("editProfileModal").style.display = "none";
}

// Delete account
async function deleteAccount() {
    if (!confirm("Are you sure you want to delete your account permanently? This cannot be undone.")) return;

    const loggedUser =
        JSON.parse(localStorage.getItem('loggedInUser')) ||
        JSON.parse(sessionStorage.getItem('loggedInUser'));

    try {
        const response = await fetch(`/users/${loggedUser._id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            localStorage.removeItem("loggedInUser");
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        } else {
            alert("Could not delete account.");
        }
    } catch (err) {
        console.error(err);
    }
}

// Close modal when clicking outside
window.addEventListener("click", function (event) {
    const modal = document.getElementById("editProfileModal");
    if (event.target === modal) {
        closeEditModal();
    }
});