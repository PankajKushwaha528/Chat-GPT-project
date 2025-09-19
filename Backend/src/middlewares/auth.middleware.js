const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Middleware to protect routes
async function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoeded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoeded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid" });
    }
}

module.exports = {authMiddleware};