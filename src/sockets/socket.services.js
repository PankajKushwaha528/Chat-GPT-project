const {Server} = require("socket.io");
const cookie = require('cookie');
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");


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

            // Save user message to DB
            await messageModel.create({
                chat: payload.chat,
                user: socket.user._id,
                content: payload.content,
                role: "user",
            });
            const chatHistory = (await messageModel.find({
                chat: payload.chat,
            }).sort({ createdAt: -1 }).limit(20).lean()).reverse()

            // console.log("Chat history:", chatHistory.map(m =>{
            //     return {
            //         role: m.role,
            //         parts:[{
            //             text: m.content
            //         }]
            //     }

            // }));
            // Generate AI response
            const response = await aiService.generateAIResponse(
                chatHistory.map(msg => {
                    return {
                        role: msg.role,
                        parts:[{
                            text: msg.content
                        }]
                    }
                })
            );

            // Save AI message to DB
            await messageModel.create({
                chat: payload.chat,
                user: socket.user._id,// You might want to use a different user ID for the AI
                content: response,
                role: "model",
            });

            console.log("AI response generated:", response);
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