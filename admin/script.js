// Fetch notes from the API
async function fetchNotes() {
    const response = await fetch('http://localhost:5000/api/note/all');

    if (response.ok) {
        const data = await response.json();
        populateNotesTable(data.notes);
    } else {
        console.error('Failed to fetch notes');
        alert('Notes fetch karne mein dikkat aa rahi hai.');
    }
}

// Populate the notes table
function populateNotesTable(notes) {
    const notesTableBody = document.querySelector('#notesTable tbody');
    notesTableBody.innerHTML = '';

    notes.forEach(note => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${note.id}</td>
            <td>${note.user_id}</td>
            <td>${note.title}</td>
            <td>${note.content}</td>
        `;
        notesTableBody.appendChild(row);
    });
}

// Fetch users from the API
async function fetchUsers() {
    const response = await fetch('http://localhost:5000/api/users/all');

    if (response.ok) {
        const data = await response.json();
        populateUsersTable(data.users);
    } else {
        console.error('Failed to fetch users');
        alert('Users fetch karne mein dikkat aa rahi hai.');
    }
}

// Populate the users table
function populateUsersTable(users) {
    const usersTableBody = document.querySelector('#usersTable tbody');
    usersTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
        `;
        usersTableBody.appendChild(row);
    });
}

// Delete a note
async function deleteNote(noteId) {
    const confirmDelete = confirm('Kya aap sach mein is note ko delete karna chahte hain?');
    if (!confirmDelete) return;

    const response = await fetch(`http://localhost:5000/api/note/${noteId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        alert('Note successfully delete ho gaya!');
        fetchNotes(); // Refresh the notes table
    } else {
        alert('Note delete karne mein dikkat aa rahi hai.');
    }
}

// Page load par fetchNotes aur fetchUsers ko call karo
fetchNotes();
fetchUsers();
