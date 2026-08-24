const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Basic route (matches Java TestController)
app.get('/', (req, res) => {
    res.send('ICMS Backend Running 🚀');
});

// API Routes (match Java controllers)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/workers', require('./routes/workers'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
