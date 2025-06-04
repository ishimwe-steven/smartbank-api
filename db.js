// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, // PostgreSQL default port
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('DB connection failed:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database!');
    release(); // release the client back to the pool
  }
});

module.exports = pool;
