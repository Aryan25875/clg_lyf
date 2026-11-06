const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }],

    isGroup: [{
        type: Boolean,
        default: false
    }],

    groupName: [{
        type: String,
        default: null
    }],

    groupAdmin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    }],

    lastMessage: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
        default: null
    }]
},{timestamps: true});

const conversationModel = mongoose.model("conversation", conversationSchema);

module.exports = conversationModel;