const express = require("express");
const{authMiddleware} = require("../middlewares/auth.middleware"); // Import the authMiddleware
const {createChat} = require("../controllers/chat.controller"); // Import the createChat controller
const router = express.Router();

// Create a new chat (Protected Route)
router.post("/", authMiddleware, createChat);

module.exports = router;