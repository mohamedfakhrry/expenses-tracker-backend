const pool = require('../config/db');

async function addExpense(req, res) {
  const { amount, description, expense_date } = req.body;
  const user_id = req.user_id;

  if (!amount || !expense_date) {
    return res.status(400).json({ error: 'Amount and expense_date are required' });
  }

  try {
    const newExpense = await pool.query(
      'INSERT INTO expenses (user_id, amount, description, expense_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, amount, description, expense_date]
    );

    res.status(201).json({ message: 'Expense added successfully', expense: newExpense.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}


async function getExpenses(req, res) {
  const user_id = req.user_id;
  const { date } = req.query;

  try {
    let result;

    if (date) {
      result = await pool.query(
        'SELECT * FROM expenses WHERE user_id = $1 AND expense_date = $2 ORDER BY expense_date DESC',
        [user_id, date]
      );
    } else {
      result = await pool.query(
        'SELECT * FROM expenses WHERE user_id = $1 ORDER BY expense_date DESC',
        [user_id]
      );
    }

    res.status(200).json({ expenses: result.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function deleteExpense(req, res) {
  const user_id = req.user_id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found or not authorized' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { addExpense , getExpenses, deleteExpense };