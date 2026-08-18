const express = require('express');
const authRoutes = require('./routes/authRoutes');
const expensesRoutes = require('./routes/expensesRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running' });
});

app.use('/auth', authRoutes);
app.use('/expenses', expensesRoutes);

module.exports = app;