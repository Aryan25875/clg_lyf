const mongoose = require('mongoose');

const postSchmea = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    
    uri:{
        type: String
    },
    
    description:{
        type: String,
    },
    
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    labels:[String],

    like:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],

    dislike:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],

    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }]
})

const postModel = mongoose.model("post", postSchmea);

module.exports = postModel;