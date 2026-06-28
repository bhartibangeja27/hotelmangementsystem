const express = require('express'); 
const cors = require('cors');       
const pool = require('./db');       
require('dotenv').config();         

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('../frontend'));

// Base Route
app.get('/', async (req, res) => {
    try {
        res.json('HOTEL MANAGEMENT SYSTEM');
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ Error: err.message });
    }
});

// ==========================================
// 1. CUSTOMER ROUTES (GET, POST, PUT, DELETE)
// ==========================================
app.get('/customer', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Customer ORDER BY customer_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.post('/customer', async (req, res) => {
    try {
        const { name, email, phone, id_proof } = req.body;
        if (!name || !email || !phone || !id_proof) {
            return res.status(400).json({ error: 'Please fill all required fields' });
        }
        const insertQuery = `INSERT INTO Customer (name, email, phone, id_proof) VALUES ($1, $2, $3, $4) RETURNING *`;
        const result = await pool.query(insertQuery, [name, email, phone, id_proof]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.put('/customer/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, id_proof } = req.body;
        const updateQuery = `UPDATE Customer SET name = $1, email = $2, phone = $3, id_proof = $4 WHERE customer_id = $5 RETURNING *`;
        const result = await pool.query(updateQuery, [name, email, phone, id_proof, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Customer not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.delete('/customer/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Customer WHERE customer_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Customer not found" });
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

// ==========================================
// 2. ROOM ROUTES (GET, POST, PUT, DELETE)
// ==========================================
app.get('/room', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Room ORDER BY room_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/room', async (req, res) => {
    try {
        const { room_number, type, price, status } = req.body;
        const result = await pool.query(
            'INSERT INTO room (room_number, type, price, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [room_number, type, price, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/room/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { room_number, type, price, status } = req.body;
        const result = await pool.query(
            'UPDATE room SET room_number = $1, type = $2, price = $3, status = $4 WHERE room_id = $5 RETURNING *',
            [room_number, type, price, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Room not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/room/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM room WHERE room_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Room not found" });
        res.json({ message: "Room deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 3. EMPLOYEES ROUTES (GET, POST, PUT, DELETE)
// ==========================================
app.get('/employees', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Employees ORDER BY employee_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/employees', async (req, res) => {
    try {
        const { name, position, phone, email, salary } = req.body;
        const result = await pool.query(
            'INSERT INTO employees (name, position, phone, email, salary) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, position, phone, email, salary]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, phone, email, salary } = req.body;
        const result = await pool.query(
            'UPDATE employees SET name = $1, position = $2, phone = $3, email = $4, salary = $5 WHERE employee_id = $6 RETURNING *',
            [name, position, phone, email, salary, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Employee not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM employees WHERE employee_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Employee not found" });
        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 4. BOOKING ROUTES (GET, POST, PUT, DELETE)
// ==========================================
app.get('/booking', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Booking ORDER BY booking_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/booking', async (req, res) => {
    try {
        const { customer_id, room_id, check_in, check_out, booking_date } = req.body;
        const result = await pool.query(
            'INSERT INTO booking (customer_id, room_id, check_in, check_out, booking_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [customer_id, room_id, check_in, check_out, booking_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/booking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_id, room_id, check_in, check_out, booking_date } = req.body;
        const result = await pool.query(
            'UPDATE booking SET customer_id = $1, room_id = $2, check_in = $3, check_out = $4, booking_date = $5 WHERE booking_id = $6 RETURNING *',
            [customer_id, room_id, check_in, check_out, booking_date, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Booking not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/booking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM booking WHERE booking_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Booking not found" });
        res.json({ message: "Booking deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 5. PAYMENT ROUTES (GET, POST, PUT, DELETE)
// ==========================================
app.get('/payment', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Payment ORDER BY payment_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/payment', async (req, res) => {
    try {
        const { booking_id, amount, method, payment_date, status } = req.body;
        const result = await pool.query(
            'INSERT INTO payment (booking_id, amount, method, payment_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [booking_id, amount, method, payment_date, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/payment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { booking_id, amount, method, payment_date, status } = req.body;
        const result = await pool.query(
            'UPDATE payment SET booking_id = $1, amount = $2, method = $3, payment_date = $4, status = $5 WHERE payment_id = $6 RETURNING *',
            [booking_id, amount, method, payment_date, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Payment not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/payment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM payment WHERE payment_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Payment not found" });
        res.json({ message: "Payment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 6. FEEDBACK ROUTES (GET, POST, PUT, DELETE)
// ==========================================
app.get('/feedback', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Feedback ORDER BY feedback_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/feedback', async (req, res) => {
    try {
        const { customer_id, booking_id, rating, comments, date } = req.body;
        const result = await pool.query(
            'INSERT INTO feedback (customer_id, booking_id, rating, comments, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [customer_id, booking_id, rating, comments, date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/feedback/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_id, booking_id, rating, comments, date } = req.body;
        const result = await pool.query(
            'UPDATE feedback SET customer_id = $1, booking_id = $2, rating = $3, comments = $4, date = $5 WHERE feedback_id = $6 RETURNING *',
            [customer_id, booking_id, rating, comments, date, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Feedback not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/feedback/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM feedback WHERE feedback_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Feedback not found" });
        res.json({ message: "Feedback deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 7. COMPLETED CRUD MODULES (Invoice, Billing, Service, Inventory)
// ==========================================

// INVOICE
app.get('/invoice', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Invoice ORDER BY invoice_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/invoice', async (req, res) => {
    try {
        const { booking_id, total_amount, issue_date, status } = req.body;
        const result = await pool.query(
            'INSERT INTO Invoice (booking_id, total_amount, issue_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [booking_id, total_amount, issue_date, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/invoice/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { booking_id, total_amount, issue_date, status } = req.body;
        const result = await pool.query(
            'UPDATE Invoice SET booking_id = $1, total_amount = $2, issue_date = $3, status = $4 WHERE invoice_id = $5 RETURNING *',
            [booking_id, total_amount, issue_date, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Invoice not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/invoice/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Invoice WHERE invoice_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Invoice not found" });
        res.json({ message: "Invoice deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// BILLING
app.get('/billing', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Billing ORDER BY bill_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/billing', async (req, res) => {
    try {
        const { customer_id, amount, due_date, status } = req.body;
        const result = await pool.query(
            'INSERT INTO Billing (customer_id, amount, due_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [customer_id, amount, due_date, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/billing/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_id, amount, due_date, status } = req.body;
        const result = await pool.query(
            'UPDATE Billing SET customer_id = $1, amount = $2, due_date = $3, status = $4 WHERE bill_id = $5 RETURNING *',
            [customer_id, amount, due_date, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Bill not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/billing/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Billing WHERE bill_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Bill not found" });
        res.json({ message: "Bill deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// SERVICE
app.get('/service', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Service ORDER BY service_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/service', async (req, res) => {
    try {
        const { service_name, description, price } = req.body;
        const result = await pool.query(
            'INSERT INTO Service (service_name, description, price) VALUES ($1, $2, $3) RETURNING *',
            [service_name, description, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/service/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { service_name, description, price } = req.body;
        const result = await pool.query(
            'UPDATE Service SET service_name = $1, description = $2, price = $3 WHERE service_id = $4 RETURNING *',
            [service_name, description, price, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Service not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/service/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Service WHERE service_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Service not found" });
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// INVENTORY
app.get('/inventory', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Inventory ORDER BY inventory_id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/inventory', async (req, res) => {
    try {
        const { item_name, quantity, status } = req.body;
        const result = await pool.query(
            'INSERT INTO Inventory (item_name, quantity, status) VALUES ($1, $2, $3) RETURNING *',
            [item_name, quantity, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, quantity, status } = req.body;
        const result = await pool.query(
            'UPDATE Inventory SET item_name = $1, quantity = $2, status = $3 WHERE inventory_id = $4 RETURNING *',
            [item_name, quantity, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Inventory item not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Inventory WHERE inventory_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Inventory item not found" });
        res.json({ message: "Inventory item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Server Connection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Connected Successfully....on PORT ${PORT}`);
});