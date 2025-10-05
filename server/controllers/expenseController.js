const mongoose = require("mongoose");
const Expense = require("../models/Expense");

//  Add new expense
// POST /api/expenses
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
      category: category || "General",
      date: date || Date.now(),
      notes: notes || "",
    });

    const savedExpense = await expense.save();
    return res.status(201).json(savedExpense);
  } catch (err) {
    console.error("Add expense error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

//  Get expenses with filters & pagination
//  GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    //extract query params
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

    //build mongo query
    let query = { user: req.user.id }; // only logged in user

    if (category) {
      query.category = category; //filter by query
    }

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    //Convert page/limit to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    //fetch expense + total count
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Expense.countDocuments(query);

    res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      expenses,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update an expense
// PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const expense = await Expense.findOne({
      _id: expenseId,
      user: req.user.id,
    });
    if (!expense) {
      return res.status(400).json({ message: "Expense not found" });
    }

    const { title, amount, category, date, notes } = req.body;

    // only overwrite fields that are provided in the request
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    if (notes !== undefined) expense.notes = notes;

    //save updated doc
    const updated = await expense.save();

    return res.json(updated);
  } catch (err) {
    console.error("updateExpense error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete an expense
// DELETE /api/expenses/:id

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("deleteExpense error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/summary
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

    const summary = await Expense.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            category: "$category",
          },
          totalSpent: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formatted = summary.map((item) => ({
      month: `${item._id.month}-${item._id.year}`,
      category: item._id.category || "General",
      totalSpent: item.totalSpent,
      transactions: item.count,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
