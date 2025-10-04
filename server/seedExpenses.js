// server/seedExpenses.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Expense = require("./models/Expense");
const User = require("./models/User");
dotenv.config();

const seedExpenses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected...");

    // Find a test user 
    const user = await User.findOne();
    if (!user) {
      console.log("❌ No user found. Please register a user first.");
      process.exit(1);
    }

    // Create sample expenses
    const expenses = [
      {
        user: user._id,
        title: "Groceries",
        amount: 1200,
        category: "Food",
        date: new Date("2025-09-10"),
        notes: "Bought rice, dal, and veggies",
      },
      {
        user: user._id,
        title: "Bus Pass",
        amount: 600,
        category: "Transport",
        date: new Date("2025-09-12"),
        notes: "Monthly bus ticket",
      },
      {
        user: user._id,
        title: "Movie Night",
        amount: 450,
        category: "Entertainment",
        date: new Date("2025-09-15"),
        notes: "Watched a new release",
      },
      {
        user: user._id,
        title: "Dinner at Cafe",
        amount: 800,
        category: "Food",
        date: new Date("2025-09-20"),
        notes: "Pizza and pasta",
      },
      {
        user: user._id,
        title: "Gym Membership",
        amount: 1500,
        category: "Health",
        date: new Date("2025-09-25"),
        notes: "Monthly gym fee",
      },
      {
        user: user._id,
        title: "Laptop Repair",
        amount: 3000,
        category: "Other",
        date: new Date("2025-10-01"),
        notes: "Replaced battery",
      },
      {
        user: user._id,
        title: "Snacks",
        amount: 200,
        category: "Food",
        date: new Date("2025-10-02"),
        notes: "Evening snacks",
      },
    ];

    // Insert into DB
    await Expense.insertMany(expenses);
    console.log("✅ Expenses seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding expenses:", error);
    process.exit(1);
  }
};

seedExpenses();
