const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', (req, res, next)=>{
    const result = authValidator.registerSchema.safeParse(req.body);

    if (!result.success){
        return res.status(400).json({
            msg : "Validation Error",
            error : result.error.issues
        })
    }

    next();

} ,authController.registerUser);

router.post('/login', (req, res, next)=>{
    const result = authValidator.loginSchema.safeParse(req.body);

    if (!result.success){
        return res.status(400).json({
            msg : "Validation Error",
            error : result.error.issues
        })
    }

    next();
} , authController.loginUser);

router.post('/change_username', authController.changeUsername);

router.post('/verify_email',(req, res, next)=>{
    const result = authValidator.onlyEmail.safeParse(req.body);

    if (!result.success){
        return res.status(400).json({
            msg : "Validation Error",
            error : result.error.issues
        })
    }

    next();
} ,authController.verifyEmail);

router.post('/changePassByOldpass', (req,res, next)=>{
    const result = authValidator.changePassByOldPassSchema.safeParse(req.body);

    if (!result.success){
        return res.status(400).json({
            msg : "Validation Error",
            error : result.error.issues
        })
    }

    next();
} ,authMiddleware.authUser ,authController.changePasswordByOldPassword);

router.post('/sendOtp_pass', (req,res,next)=>{
    const result = authValidator.onlyEmail.safeParse(req.body);

    if (!result.success){
        return res.status(400).json({
            msg : "Validation Error",
            error : result.error.issues
        })
    }

    next();
} ,authController.sendOtpforPasswordChange);

router.post('/change_pass_otp', (req, res, next)=>{
    const result = authValidator.changePasswordbyOtpSchema.safeParse(req.body);

    if (!result.success){
        return res.status(400).json({
            msg : "Validation Error",
            error : result.error.issues
        })
    }

    next();
} ,authController.changePasswordbyOtp);

router.get('/refresh', authController.refresh);

router.get('/resend-otp', authController.resendOtp);

module.exports = router;