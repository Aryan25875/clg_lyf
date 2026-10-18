const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

async function authUser(req, res, next){
    try{
        const token = req.cookies.token;

        if (!token){
            return res.status(400).json({
                msg : "Authentication required"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

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