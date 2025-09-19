const express = require ('express');
const cookie = require('cookie-parser');
const cors = require('cors');
// Routes
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

// Initialize app
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;