const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },

    email:{
        type: String,
        unique: true,
        required: true
    },

    password:{
        type: String,
    },

    verified:{
        type: Boolean,
        default: false
    },
})

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

