const express = require("express");
const{authMiddleware} = require("../middlewares/auth.middleware"); // Import the authMiddleware
const {createChat,getChats,getMessages} = require("../controllers/chat.controller"); // Import the createChat controller
const router = express.Router();

// Create a new chat (Protected Route)
/* POST /api/chat/ */
router.post("/", authMiddleware, createChat);

/* GET /api/chat/ */
router.get('/', authMiddleware, getChats)


/* GET /api/chat/messages/:id */
router.get('/messages/:id', authMiddleware, getMessages)

module.exports = router;