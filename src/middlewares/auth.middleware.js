const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const sessionModel = require('../models/session.model');
const bcrypt = require('bcrypt');

async function authUser(req, res, next){
    try{
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken){
            return res.status(400).json({
                msg : "refresh token required"
            })
        }

        
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user){
            return res.status(400).json({
                msg: "User Not found"
            })
        }
        
        const sessions = await sessionModel.find({user:user._id, revoked: false});
        let session = null;
        for (let ele of sessions){
            if (bcrypt.compare(refreshToken, ele.refreshTokenHash)){
                session = ele;
                break;
            }
        }

        if (!session){
            return res.status(400).json({
                msg: "session not found"
            })
        }

        if (!user.verified){
            return res.status(400).json({
                msg: "User is not Verified"
            })
        }

        req.user = decoded;

        next();

    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg : "Auth failed"
        })
    }
}



module.exports = {authUser};