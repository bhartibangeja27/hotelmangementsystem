const { Pool } = require('pg'); // <-- This line requires the 'pg' module
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
});

module.exports = pool;   