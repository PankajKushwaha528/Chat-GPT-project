const {Server} = require("socket.io");
const cookie = require('cookie');
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
function initSocketServer(httpServer){
    const io = new Server(httpServer, {});

    io.use(async(socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || '');
        const token = cookies.token;
      if(!token){
        return next(new Error("Authentication error - no token"));
      }
        try{
            const decoeded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoeded.id);

            if(!user){
                return next(new Error("Authentication error - token not valid"));
            }

            socket.user = user; // Attach user info to socket object
            next();
        }catch(error){
            return next(new Error("Authentication error - token not valid"));
        }

    });
    
    io.on("connection", (socket) => {


        socket.on("ai-message", async (payload) => {
            console.log("AI message received:", payload);

            const response = await aiService.generateAIResponse(payload.content);

            socket.emit("ai-response", { 
                content: response,
                chat: payload.chat 
            }); 
        });

        // console.log("Socket user:", socket.user);
        // console.log("A user connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });
}

module.exports = initSocketServer;  