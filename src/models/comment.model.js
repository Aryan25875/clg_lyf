const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required : true,
    },

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    },

    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        default: null
    }
})

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;