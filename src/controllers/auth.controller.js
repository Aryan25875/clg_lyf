const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const {generateOtp, getOtpHtml} = require('../utils/utils');
const otpModel = require('../models/otp.model');
const sendEmail = require('../services/email.service');
const {checkOtp} = require('../utils/checkOtp');


function collegeEmailValidator(email){
    const domain = process.env.COLLEGE_EMAIL_DOMAIN;

    return email.endsWith(`@${domain}`);

}

async function registerUser(req, res){
    try{
        const {email, password, username} = req.body;

        if (!collegeEmailValidator(email)){
            return res.status(403).json({
                msg: "Only college email addresses are allowed"
            })
        }

        const foundEmail = await userModel.findOne({email});
        if (foundEmail){
            return res.status(409).json({
                msg : "User with this email already exists"
            })
        }
        const foundUsername = await userModel.findOne({username});
        if (foundUsername){
            return res.status(409).json({
                msg : "Username Alredy in used"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await userModel.create({username, email, password: hashedPassword});
        
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);
        
        res.cookie("token", token);

        const otp = generateOtp();
        const html = getOtpHtml(otp);
        const otpHash = await bcrypt.hash(otp, 10);

        await otpModel.deleteMany({ email });

        await otpModel.create({
            otpHash,
            user: user._id,
            email,
            expiresAt: new Date(Date.now() + (5*1000*60))
        })

        await sendEmail(email, "OTP Verification", `Your OTP Code is ${otp}`, html);
        
        res.status(201).json({
            msg : "User Created Successfully, Check for OTP",
            user
        })
    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg : "Issue in registerUser",
        })
    }
}

async function loginUser(req, res){
    try{
        const {username, email, password} = req.body;

        const user = await userModel.findOne({
            $or: [
                {username},
                {email}
            ]
        })

        if (!collegeEmailValidator(email)){
            return res.status(403).json({
                msg: "Only college email addresses are allowed"
            })
        }

        if (!user){
            return res.status(404).json({
                msg: "User with this email or username not found"
            })
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result){
            return res.status(401).json({
                msg : "Invalid Credentials"
            })
        }

        

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.cookie("token", token);

        return res.status(200).json({
            msg : "User Logged In successfully",
            user
        })

    }catch(err){
        return res.status(400).json({
            msg: "Issue in loginUser",
            error: err
        })
    }
}

async function changeUsername(req, res){
    try{
        const token = req.cookies?.token;

        if (!token){
            return res.status(400).json({
                msg: "Token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const {newUsername} = req.body;

        const found = await userModel.findOne({username: newUsername});

        if (found){
            return res.status(400).json({
                msg: "Username already exists"
            })
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            decoded.id, {$set: {username: newUsername}},
            {returnDocument:'after', runValidators: true}
        );

        res.status(200).json({
            msg: "Username Updated successfully",
            updatedUser
        });
    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg : "Authentication Issue",
        })
    }
}

async function logout(req, res){
    res.clearCookie("token");

    return res.status(200).json({
        msg: "User Logged Out"
    })
}

async function verifyEmail(req, res){
    try{
        const {otp, email} = req.body;
    
        if (!otp){
            return res.status(404).json({
                msg: "OTP is required"
            })
        }
    
        const user = await userModel.findOne({email});
        if (!user){
            return res.status(404).json({
                msg: "Invalid Email, user not found"
            })
        }
    
        if (user.verified){
            return res.status(400).json({
                msg: "Email is already verified"
            })
        }
    
        const result = await checkOtp(otp, email);
    
        if (!result.valid){
            return res.status(400).json({
                msg : result.msg
            })
        }
    
        if (result.otpObj.user.toString() !== user._id.toString()){
            return res.status(400).json({
                msg: "Invalid OTP"
            })
        }
    
        user.verified = true;
        await user.save();
    
    
        await otpModel.deleteOne({user: result.otpObj.user})
    
        return res.status(200).json({
            msg : "Email Verified Successfully",
            user
        })
    }catch(err){
        console.log("Verify Email Error : ", err);
        return res.status(400).json({
            msg: "Error in Email verification"
        })
    }

}

async function changePasswordByOldPassword(req, res){
    const {email, password, newPassword} = req.body;

    const user = await userModel.findOne({email});

    if (!user){
        return res.status(404).json({
            msg: "User not found"
        })
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result){
        return res.status(400).json({
            msg: "Wrong Password"
        })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
        msg: "Password changed"
    })    
}

async function sendOtpforPasswordChange(req, res){
    const {email} = req.body;

    const user = await userModel.findOne({email});

    if (!user){
        return res.status(404).json({
            msg: "Email Not found"
        })
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const html = getOtpHtml(otp);

    await otpModel.deleteMany({ email });


    const otpObj = await otpModel.create({
        email,
        user: user._id,
        otpHash: hashedOtp,
        expiresAt: new Date(Date.now() + (5*1000*60)),
    })

    await sendEmail(email, "OTP Verification", `Your OTP Code is ${otp}`, html);

    return res.status(200).json({
        msg: "OTP Sended",
        otpObj
    })
}

async function changePasswordbyOtp(req, res){
    const {otp, email, newPassword} = req.body;

    const result = await checkOtp(otp, email);

    if (!result.valid){
        return res.status(400).json({
            msg: result.msg
        })
    }

    const user = await userModel.findOne({email});
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    user.password = hashedPassword;

    await user.save();

    await otpModel.deleteOne({user: result.otpObj.user})

    res.status(200).json({
        msg: "Password Changed Successfully"
    })
}

module.exports = {registerUser, loginUser, changeUsername, logout, verifyEmail, changePasswordByOldPassword, sendOtpforPasswordChange, changePasswordbyOtp};



