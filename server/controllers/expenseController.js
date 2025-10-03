const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      category: category || 'General',
      date: date || Date.now(),
      notes: notes || ''
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);

  } catch (err) {
    console.error('Add expense error:', err);
    res.status(500).json({ message: "Server Error" });
  }
};
