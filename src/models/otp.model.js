const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    otpHash: {
        type: String,
        required: true,
    },

    expiresAt:{
        type: Date,
        required: true
    },

    attempts:{
        type: Number,
        default: 0
    }
},{
    timestamps:true 
})

const otpModel = mongoose.model("otp", otpSchema);

module.exports = otpModel;




