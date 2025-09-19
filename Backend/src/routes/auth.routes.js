const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/auth.controller');
const router = express.Router();


// User Registration
router.post('/register', registerUser); 

// User Login
router.post('/login', loginUser);

// User Logout
// router.post('/logout', logoutUser);

module.exports = router;