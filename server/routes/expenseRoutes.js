const express = require('express');
const router = express.Router();
const { addExpense } = require('../controllers/expenseController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, addExpense);

module.exports = router;
