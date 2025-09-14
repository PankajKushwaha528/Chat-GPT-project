const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
       
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      
    },
    content:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["user", "model" , "system"],
        default: "user",
    }
},{
    timestamps: true,
}); 
module.exports = mongoose.model("Message", messageSchema);
    