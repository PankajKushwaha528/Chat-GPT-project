const express = require ('express');
const cookie = require('cookie-parser');
const cors = require('cors');
const path = require('path')
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
app.use(express.static(path.join(__dirname, '../public')))

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

//wildcard
app.get('*name',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/index.html'));
});

module.exports = app;