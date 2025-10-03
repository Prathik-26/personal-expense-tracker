require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authMiddleware = require('./middlewares/authMiddleware');


const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Authentication route
app.use('/api/auth', require('./routes/authRoutes'));

// Expense route - protected by auth
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send("Expense tracker is running");
});

// Protected route - requires valid JWT token
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({message: `Hello ${req.user.id}, you accessed a protected route!`})
})

// mongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
