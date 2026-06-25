const API = 'https://animated-dollop-vpvq555j6r6cwjqx-3000.app.github.dev';

async function loadFeedbacks() {
    const res = await fetch(API + '/feedback');
    const data = await res.json();
    const tbody = document.querySelector('#feedbacktable tbody');
    tbody.innerHTML = data.map(f => `
        <tr>
            <td>${f.feedback_id}</td>
            <td>${f.customer_id}</td>
            <td>${f.booking_id}</td>
            <td>${f.rating}</td>
            <td>${f.comments}</td>
            <td>${f.date ? f.date.split('T')[0] : ''}</td>
        </tr>
    `).join('');
}

document.getElementById('addFeedbackForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const body = {
        customer_id: document.getElementById('customer_id').value,
        booking_id: document.getElementById('booking_id').value,
        rating: document.getElementById('rating').value,
        comments: document.getElementById('comments').value,
        date: document.getElementById('date').value
    };
    await fetch(API + '/feedback', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    loadFeedbacks();
    bootstrap.Modal.getInstance(document.getElementById('addFeedbackModal')).hide();
    this.reset();
});

loadFeedbacks();