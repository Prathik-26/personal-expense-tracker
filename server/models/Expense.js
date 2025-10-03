const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    amount: {type: Number, required: true,  min: [0, 'Amount cannot be negative']},
    category: {type: String, default: 'General'},
    date: {type: Date, default: Date.now},
    notes: {type: String, default: ''}
}, {timestamps: true});

module.exports = mongoose.model('Expense', ExpenseSchema);
