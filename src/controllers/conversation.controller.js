const conversationModel = require('../models/conversation.model');
const messageModel = require('../models/message.model');
const requestModel = require('../models/request.model');
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken');


async function sendRequest(req, res){
    try{
        const {accessToken, receiverUsername, requestType, note} = req.body;
        if (!accessToken){
            return res.status(400).json({
                msg: "Access Token not found"
            })
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user){
            return res.status(400).json({
                msg: "User not found"
            })
        }

        if (!receiverUsername || (requestType !== "friend" && requestType !== "addInGroup") ){
            return res.status(400).json({
                msg: "Invalid Input"
            })
        }

        const requestedUser = await userModel.findOne({username: receiverUsername});
        if (!requestedUser){
            return res.status(404).json({
                msg: "user not found"
            })
        }
        console.log(requestedUser);

        const request = await requestModel.create({
            requestType,
            sender: user._id,
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



module.exports = {sendRequest}