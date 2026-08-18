const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expensesController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, addExpense);
router.get('/', verifyToken, getExpenses);
router.delete('/:id', verifyToken, deleteExpense);

module.exports = router;