const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const otpModel = require('../models/otp.model');
const sendOtp = require('../services/email.service');
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
        
        const accessToken = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn: "15m"});
        const refreshToken = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000
        });

        sendOtp(user);

       
        res.status(201).json({
            msg : "User Created Successfully, Check for OTP",     
            accessToken,       
            username: user.username,
            email: user.email,
            verified: user.verified
        })
    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg : "Issue in registerUser",
        })
    }
}

async function refresh(req, res){
    try{
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken){
            return res.status(401).json({
                msg: "Refresh Token not found"
            })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }

        const accessToken = jwt.sign({id: decoded.id}, process.env.JWT_SECRET,{
            expiresIn: "15m"
        })

        const newRefreshToken = jwt.sign({id: decoded.id}, process.env.JWT_SECRET,{expiresIn: "7d"});
        res.cookie("refreshToken", newRefreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: "strict", 
            maxAge: 7*24*60*60*1000
        });

        return res.status(200).json({
            msg: "Access Token generated successfully",
            accessToken
        })


    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: "Error in generating access token"
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

        const result = bcrypt.compare(password, user.password);

        if (!result){
            return res.status(401).json({
                msg : "Invalid Credentials"
            })
        }

        const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "15m"});
        const refreshToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000
        });

        res.status(200).json({
            msg : "User logged in successfully",
            accessToken,
            username: user.username,
            email: user.email,
            verified: user.verified
        })

    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: "Issue in loginUser"
        })
    }
}

async function changeUsername(req, res){
    try{
        const {accessToken, newUsername} = req.body;
        if (!newUsername){
            return res.status(400).json({
                msg: "Username field can't be empty"
            })
        }

        if (!accessToken){
            return res.status(400).json({
                msg: "accessToken not found"
            })
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

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
            username: updatedUser.username,
            email: updatedUser.email,
            verified: updatedUser.verified
            
        });
    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg : "Error in changeUsername",
        })
    }
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
            username: user.username,
            email: user.email,
            verified: user.verified
        })

    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: "Error in Email verification"
        })
    }

}

async function changePasswordByOldPassword(req, res){
    try{
        const {email, password, newPassword} = req.body;
    
        const user = await userModel.findOne({email});
    
        if (!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }
    
        const result = bcrypt.compare(password, user.password);
    
        if (!result){
            return res.status(400).json({
                msg: "Wrong Password"
            })
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
    
        await user.save();
    
        res.status(200).json({
            msg: "Password changed"
        })    
    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: "Error in change password by old password"
        })
    }
}

async function sendOtpforPasswordChange(req, res){
    try{
        const {email} = req.body;
    
        const user = await userModel.findOne({email});
    
        if (!user){
            return res.status(404).json({
                msg: "Email Not found"
            })
        }
    
        sendOtp(user);

        res.status(200).json({
            msg: "OTP sent",
            email: otpObj.email,
            userid: otpObj.user,
        })
    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: "Error in sendOtpforPasswordChange"
        })
    }
}

async function changePasswordbyOtp(req, res){
    try{
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
    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: "Error in changePasswordbyOtp"
        })
    }
}

async function resendOtp(req, res){
    try{
        const {email} = req.body;
        if (!email){
            return res.status(400).json({
                msg: "Email not found"
            })
        }
        const user = await userModel.findOne({email});
        if (!user){
            return res.status(400).json({
                msg: "Invalid email"
            })
        }

        const otpObj = await otpModel.findOne({email});

        if (!otpObj){
            return res.status(400).json({
                msg: "Please Request an OTP first"
            })
        }

        const cooldown = 2*60*1000;
        const elapsed = Date.now() - otpObj.lastSentAt.getTime();

        if (elapsed < cooldown){
            const remainingSeconds = Math.ceil(
                (cooldown - elapsed) / 1000
            );

            return res.status(429).json({
                msg: `Please Wait ${remainingSeconds} seconds before resending OTP`,
                retryAfterSeconds: remainingSeconds
            });
        }

        

        await sendOtp(user);
        

        res.status(200).json({
            msg: "OTP sent successfully",
            retryAfterSeconds: 120
        })

    }catch(err){
        console.log(err);
        return res.status(400).json({
            msg: "Error in resendOtp"
        })
    }
    
}



module.exports = {registerUser, loginUser, changeUsername, verifyEmail, changePasswordByOldPassword, sendOtpforPasswordChange, changePasswordbyOtp, refresh, resendOtp};



