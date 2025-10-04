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


//  Get expenses with filters & pagination
//  GET /api/expenses
exports.getExpenses = async(req, res) => {
  try {
    
    //extract query params
    const {category, startDate, endDate, page=1, limit=10} = req.query;

    //build mongo query
    let query = {user: req.user.id} // only logged in user

    if(category) {
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
    const pageNum = parseInt(page,10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum-1)*limitNum;


    //fetch expense + total count
    const expenses = await Expense.find(query)
      .sort({date: -1})
      .skip(skip)
      .limit(limitNum)

    const total = await Expense.countDocuments(query);


    res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total/limitNum),
      expenses
    });


  } catch (err) {
    console.error(err.message);
    res.status(500).json({message: "Server Error"})
  }
}