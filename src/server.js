const app = require('./app');
const pool = require('./config/db');

const PORT = 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0]);
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
});