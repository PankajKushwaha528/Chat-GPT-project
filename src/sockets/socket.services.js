const {Server} = require("socket.io");
const cookie = require('cookie');
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const {createMemory,queryMemory} = require("../services/vector.service");
const { text } = require("express");

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

           
            const [message, vectors] = await Promise.all([
                messageModel.create({
                chat: payload.chat,
                user: socket.user._id, 
                content: payload.content,
                role: "user",
            }),
                aiService.generateVector(payload.content),

               

            ])
            
             await createMemory({
                vectors: vectors,
                messageId: message._id,
                metadata: {
                    chat: payload.chat,
                    user: socket.user._id,
                    text: payload.content
                }
            })
           
           
           const [memory ,chatHistory] = await Promise.all([
                queryMemory({
                queryVector: vectors,
                limit: 3,
               metadata: {
                    user: socket.user._id
                },
             
            }),
            messageModel.find({
                    chat: payload.chat
                }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse())

           ])

            const stm =  chatHistory.map(msg => {
                    return {
                        role: msg.role,
                        parts:[{
                            text: msg.content
                        }]
                    }
                })

            const ltm = [
                {
                    role:'user',
                    parts:[{
                        text: ` These are previous message from the chat use them to generate a response
                        ${memory.map(item => item.metadata.text).join('\n')} `
                    }] 
                }
            ]
            // Generate AI response
            const response = await aiService.generateAIResponse([...ltm , ...stm]);
            
            console.log("AI response generated:", response);
            socket.emit("ai-response", { 
                content: response, 
                chat: payload.chat 
            }); 
            // Save AI message to DB

            const [responseMessage , responseVectors] = await Promise.all([
                messageModel.create({
                chat: payload.chat,
                user: socket.user._id,// You might want to use a different user ID for the AI
                content: response,
                role: "model",
            }),
                aiService.generateVector(response)
            ])

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chat: payload.chat,
                    user: socket.user._id,
                    text: response
                }
            })
 
        });

       

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });
}

module.exports = initSocketServer;  