const otpModel = require('../models/otp.model');
const bcrypt = require('bcrypt');

async function checkOtp(otp, email){
    const otpObj = await otpModel.findOne({email});
    if (!otpObj){
        return { valid: false, msg: "Invalid OTP or Email" };
    }

    if (otpObj.expiresAt <= new Date()){
        await otpModel.deleteOne({user: otpObj.user})
        return { valid: false, msg: "OTP Expired" };
    }

    if (otpObj.attempts >= 5){
        await otpModel.deleteOne({user: otpObj.user});
        return {valid: false, msg: "OTP Expired, Please try sending OTP again"};
    }

    const check = await bcrypt.compare(otp.toString(), otpObj.otpHash.toString());


    if (!check) {
        otpObj.attempts += 1;
        await otpObj.save();
        return { valid: false, msg: "Invalid OTP" };
    }

    return { valid: true, otpObj };
}

module.exports = {checkOtp};







