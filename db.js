// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for Neon and other cloud DBs
  },
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database!'))
  .catch((err) => console.error('❌ DB connection failed:', err));

module.exports = pool;
