const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, default: "" },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },

  password: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },

  settings: {
    monthlyBudget: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
  },
});

module.exports = mongoose.model("User", UserSchema);
