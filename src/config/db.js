require('dotenv').config();
const { Pool, types } = require('pg');

// امنع pg من تحويل DATE لـ JavaScript Date object، خليه يرجعه كنص زي ما هو
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;