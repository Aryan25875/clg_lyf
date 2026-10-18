function generateOtp(){
    return Math.floor(100000 + Math.random()*900000).toString();
}

function getOtpHtml(OTP){
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
        style="background-color: #f4f4f7; padding: 30px 10px;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                    style="max-width: 480px; background-color: #ffffff; border-radius: 10px; overflow: hidden;">

                    <!-- Header -->
                    <tr>
                        <td align="center"
                            style="background-color: #2563eb; padding: 25px 20px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">
                                Email Verification
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px 25px; color: #333333;">

                            <p style="font-size: 16px; margin-top: 0;">
                                Hello,
                            </p>

                            <p style="font-size: 15px; line-height: 1.6;">
                                Use the verification code below to verify your email address.
                            </p>

                            <!-- OTP -->
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td align="center"
                                        style="background-color: #eff6ff; border: 1px dashed #2563eb; border-radius: 8px; padding: 20px;">
                                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1d4ed8;">
                                            ${OTP}
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 14px; line-height: 1.6; margin-top: 25px;">
                                This code will expire in <strong>5 minutes</strong>.
                                Please do not share it with anyone.
                            </p>

                            <p style="font-size: 14px; line-height: 1.6;">
                                If you didn't request this code, you can safely ignore this email.
                            </p>

                            <p style="font-size: 15px; margin-bottom: 0;">
                                Regards,<br>
                                <strong>Aryan</strong>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center"
                            style="background-color: #f9fafb; padding: 15px 20px; color: #6b7280; font-size: 12px;">
                            This is an automated email. Please do not reply.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`
}

module.exports = {generateOtp, getOtpHtml};


