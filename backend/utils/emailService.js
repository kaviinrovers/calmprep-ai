import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer transporter
 * Note: Uses Gmail App Passwords for security
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

/**
 * Send OTP Verification Email
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit verification code
 */
export const sendOTPEmail = async (to, otp) => {
    const mailOptions = {
        from: `"CampRep AI Security" <${process.env.GMAIL_USER}>`,
        to,
        subject: 'Verification code for CampRep AI',
        text: `Your verification code is ${otp}. This code expires in 10 minutes. Do not share this code with anyone. If you did not request this, please ignore this email.`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">CampRep AI</h2>
                <p style="color: #475569; font-size: 16px; line-height: 1.5;">
                    A request has been made to access your account or set a new password. Use the following verification code to proceed:
                </p>
                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 6px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3b82f6;">${otp}</span>
                </div>
                <p style="color: #475569; font-size: 14px;">
                    This code will expire in <strong>10 minutes</strong>.
                </p>
                <p style="color: #64748b; font-size: 12px; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                    For your security, do not share this code with anyone. CampRep AI team will never ask for this code over phone or message.<br><br>
                    If you did not request this verification, you can safely ignore this email.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email Sending Error:', error);
        throw new Error('Failed to send verification email');
    }
};
