const conversationModel = require('../models/conversation.model');
const messageModel = require('../models/message.model');
const requestModel = require('../models/request.model');
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken');


async function sendRequest(req, res){
    try{
        const {receiverUsername, requestType, note} = req.body;

        if (!receiverUsername || (requestType !== "friend" && requestType !== "addInGroup") ){
            return res.status(400).json({
                msg: "Invalid Input"
            })
        }

        const requestedUser = await userModel.findOne({username: receiverUsername});
        if (!requestedUser && !requestedUser.verified){
            return res.status(404).json({
                msg: "user not found"
            })
        }

        if (requestedUser === req.user){
            return res.status(400).json({
                msg: "Can't send friend request to yourself"
            })
        }

        console.log(requestedUser);

        const request = await requestModel.create({
            requestType,
            sender: req.user._id,
            requestFor: requestedUser._id,
            note: note,
        })

        return res.status(200).json({
            msg: "Request sent successfully",
            request
        })

    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: "Error in sendRequest"
        })
    }
}

async function seeAllPendingReqs(req, res){
    try{
        const requests = await requestModel.findOne({
            requestFor: req.user._id
        });

        return res.status(200).json({
            msg: "All requests fetched successfully",
            requests
        })

    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: "Error in seeAllPendingReqs function"
        })
    }
}

module.exports = {sendRequest, seeAllPendingReqs}