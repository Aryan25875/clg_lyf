const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

async function authUser(req, res, next) {
    try {
        const {accessToken} = req.body;

        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_SECRET
        );

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                msg: "User not found"
            });
        }

        if (!user.verified) {
            return res.status(403).json({
                msg: "User is not verified"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            msg: "Authentication failed in authUser Middleware"
        });
    }
}

module.exports = { authUser };