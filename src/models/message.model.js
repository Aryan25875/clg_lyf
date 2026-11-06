const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversation",
        required: true
    },
    
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    content:{
        type: String,
        required: true
    },

    messageType:{
        type: String,
        enum: ["text", "file", "image"],
        default: "text"
    }
}, {timestamps: true});


const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;

