const API = 'https://animated-dollop-vpvq555j6r6cwjqx-3000.app.github.dev';

async function loadEmployees() {
    const res = await fetch(API + '/employees');
    const data = await res.json();
    const tbody = document.querySelector('#employeetable tbody');
    tbody.innerHTML = data.map(e => `
        <tr>
            <td>${e.employee_id}</td>
            <td>${e.name}</td>
            <td>${e.position}</td>
            <td>${e.phone}</td>
            <td>${e.email}</td>
            <td>${e.salary}</td>
        </tr>
    `).join('');
}

document.getElementById('addEmployeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const body = {
        name: document.getElementById('emp_name').value,
        position: document.getElementById('position').value,
        phone: document.getElementById('emp_phone').value,
        email: document.getElementById('emp_email').value,
        salary: document.getElementById('salary').value
    };
    await fetch(API + '/employees', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });
    loadEmployees();
    bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal')).hide();
    this.reset();
});

loadEmployees();