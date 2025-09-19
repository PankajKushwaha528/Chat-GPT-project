const chatModel = require("../models/chat.model");
// Create a new chat
async function createChat(req, res) {
    const {title} = req.body;
    const user = req.user;
    try {
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const chat = await chatModel.create({
            title,
            user: user._id,
        });
        return res.status(201).json({ 
            message: "Chat created successfully",
         chat: {
            id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user,
         } });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { createChat };