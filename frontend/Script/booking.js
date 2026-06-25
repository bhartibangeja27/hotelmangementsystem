const API = 'https://animated-dollop-vpvq555j6r6cwjqx-3000.app.github.dev';

async function loadBookings() {
    const res = await fetch(API + '/booking');
    const data = await res.json();
    const tbody = document.querySelector('#bookingtable tbody');
    tbody.innerHTML = data.map(b => `
        <tr>
            <td>${b.booking_id}</td>
            <td>${b.customer_id}</td>
            <td>${b.room_id}</td>
            <td>${b.check_in}</td>
            <td>${b.check_out}</td>
            <td>${b.booking_date}</td>
        </tr>
    `).join('');
}

document.getElementById('addBookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const body = {
        customer_id: document.getElementById('customer_id').value,
        room_id: document.getElementById('room_id').value,
        check_in: document.getElementById('check_in').value,
        check_out: document.getElementById('check_out').value,
        booking_date: document.getElementById('booking_date').value
    };
    await fetch(API + '/booking', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    loadBookings();
    bootstrap.Modal.getInstance(document.getElementById('addBookingModal')).hide();
    this.reset();
});

loadBookings();