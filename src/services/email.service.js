const nodemailer = require('nodemailer');
const otpModel = require('../models/otp.model');
const {generateOtp, getOtpHtml} = require('../utils/utils');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: process.env.GOOGLE_USER,
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
	},
});


// Verify the connection configuration
transporter.verify((error, success) => {
	if (error) {
		console.error('Error connecting to email server:', error);
	} else {
		console.log('Email server is ready to send messages');
	}
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
	try {
		await transporter.sendMail({
			from: `"Aryan" <${process.env.GOOGLE_USER}>`, // sender address
			to, // list of receivers
			subject, // Subject line
			text, // plain text body
			html, // html body
		});

		console.log('Message sent');
	} catch (error) {
		console.error('Error sending email:', error);
	}
};

async function sendOtp(user) {
    const otp = generateOtp();
    const html = getOtpHtml(otp);
    const otpHash = await bcrypt.hash(otp, 10);

    const now = new Date();

    const otpData = {
        otpHash,
        user: user._id,
        email: user.email,
        expiresAt: new Date(now.getTime() + 5 * 60 * 1000),
        lastSentAt: now,
        attempts: 0
    };

    await otpModel.findOneAndUpdate(
        { email: user.email },
        { $set: otpData },
        { upsert: true, returnDocument: "after", runValidators: true }
    );

    await sendEmail(user.email,"OTP Verification",`Your OTP Code is ${otp}`,html);
}

module.exports = sendOtp;
