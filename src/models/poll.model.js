const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    options: [{
        option_title: {type: String, required: true},
        votes: [{
            type:mongoose.Schema.Types.ObjectId,
            ref: "user"
        }]
    }]
})


const pollModel = mongoose.model("poll", pollSchema);

module.exports = pollModel;
