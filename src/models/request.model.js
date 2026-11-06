const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestType: {
        type: String,
        enum: ["friend", "addInGroup"],
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    requestFor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    note:{
        type: String,
        default: null
    },

    answer: {
        type: Boolean,
        default: null
    }

},{timestamps: true})

const requestModel = mongoose.model("request", requestSchema);

module.exports = requestModel;

