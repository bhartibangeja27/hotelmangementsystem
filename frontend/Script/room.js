const API = 'https://animated-dollop-vpvq555j6r6cwjqx-3000.app.github.dev';

async function loadRooms() {
    const res = await fetch(API + '/room');
    const data = await res.json();
    const tbody = document.querySelector('#roomtable tbody');
    tbody.innerHTML = data.map(r => `
        <tr>
            <td>${r.room_id}</td>
            <td>${r.room_number}</td>
            <td>${r.type}</td>
            <td>${r.price}</td>
            <td>${r.status}</td>
        </tr>
    `).join('');
}

document.getElementById('addRoomForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const body = {
        room_number: document.getElementById('room_number').value,
        type: document.getElementById('type').value,
        price: document.getElementById('price').value,
        status: document.getElementById('status').value
    };
    await fetch(API + '/room', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    loadRooms();
    bootstrap.Modal.getInstance(document.getElementById('addRoomModal')).hide();
    this.reset();
});

loadRooms();
