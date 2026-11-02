const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"]
    },

    refreshTokenHash:{
        type: String,
        required: [true, "refreshTokenHash is required"]
    },

    ip: {
        type: String,
        required: [true, "IP is required"]
    },

    userAgent: {
        type: String,
        required: [true, "userAgent is required"]
    },

    revoked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const sessionModel = mongoose.model("session", sessionSchema);

module.exports = sessionModel;