const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Neon DB connection FAILED:', err.message);
  } else {
    console.log('Neon DB connected successfully!');
    release();
  }
});

module.exports = pool;
