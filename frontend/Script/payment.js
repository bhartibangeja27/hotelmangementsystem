const API = 'https://animated-dollop-vpvq555j6r6cwjqx-3000.app.github.dev';

async function loadPayments() {
    const res = await fetch(API + '/payment');
    const data = await res.json();
    const tbody = document.querySelector('#paymenttable tbody');
    tbody.innerHTML = data.map(p => `
        <tr>
            <td>${p.payment_id}</td>
            <td>${p.booking_id}</td>
            <td>${p.amount}</td>
            <td>${p.method}</td>
            <td>${p.payment_date ? p.payment_date.split('T')[0] : ''}</td>
            <td>${p.status}</td>
        </tr>
    `).join('');
}

document.getElementById('addPaymentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const body = {
        booking_id: document.getElementById('booking_id').value,
        amount: document.getElementById('amount').value,
        method: document.getElementById('method').value,
        payment_date: document.getElementById('payment_date').value,
        status: document.getElementById('status').value
    };
    await fetch(API + '/payment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    loadPayments();
    bootstrap.Modal.getInstance(document.getElementById('addPaymentModal')).hide();
    this.reset();
});

loadPayments();