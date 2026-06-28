const API = 'https://animated-dollop-vpvq555j6r6cwjqx-3000.app.github.dev';
let editCustomerId = null; // Isse pata chalega ki hum save kar rahe hain ya edit

// 1. Customers Load karne ka function (Table mein Edit aur Delete buttons ke sath)
async function loadCustomers() {
    try {
        const res = await fetch(API + '/customer');
        const data = await res.json();
        const tbody = document.querySelector('#customertable tbody');
        
        tbody.innerHTML = data.map(c => `
            <tr>
                <td>${c.customer_id}</td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>${c.id_proof}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="editCustomer(${c.customer_id}, '${c.name}', '${c.email}', '${c.phone}', '${c.id_proof}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${c.customer_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Error loading customers:", err);
    }
}

// 2. Form Submit: Add (POST) aur Update (PUT) dono isi se handle honge
document.getElementById('addCustomerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const body = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        id_proof: document.getElementById('idProof').value
    };

    try {
        if (editCustomerId) {
            // Agar editCustomerId set hai, toh PUT request (Update) chalegi
            await fetch(`${API}/customer/${editCustomerId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            editCustomerId = null; // Reset track
        } else {
            // Agar null hai, toh naya data POST (Create) hoga
            await fetch(API + '/customer', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
        }

        loadCustomers(); // Table refresh karein
        
        // Modal ko close karein aur form clear karein
        const modalElement = document.getElementById('addCustomerModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();
        this.reset();
        
    } catch (err) {
        console.error("Error saving customer:", err);
    }
});

// 3. Edit Button click hone par data modal form mein fill karne ke liye
function editCustomer(id, name, email, phone, idProof) {
    editCustomerId = id;
    
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
    document.getElementById('idProof').value = idProof;
    
    document.getElementById('modalTitle').innerText = "Edit Customer Details";
    
    const modalElement = document.getElementById('addCustomerModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.show();
}

// 4. Delete karne ke liye function
async function deleteCustomer(id) {
    if (confirm("Are you sure you want to delete this customer?")) {
        try {
            await fetch(`${API}/customer/${id}`, {
                method: 'DELETE'
            });
            loadCustomers(); // Table refresh karein
        } catch (err) {
            console.error("Error deleting customer:", err);
        }
    }
}

// Initial Load
loadCustomers();

