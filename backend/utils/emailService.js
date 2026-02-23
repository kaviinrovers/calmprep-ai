import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer transporter
 * Uses Gmail App Passwords for security
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

/**
 * Send OTP Email
 * @param {string} to - Recipient email
 * @param {string} otpCode - 6-digit OTP code
 */
export const sendOTPEmail = async (to, otpCode) => {
    const mailOptions = {
        from: `"CalmPrep AI" <${process.env.GMAIL_USER}>`,
        to,
        subject: 'Your CalmPrep AI login code',
        text: `Your login code for CalmPrep AI is: ${otpCode}. This code is valid for 10 minutes. Do not share this code with anyone. If you did not request this, you can safely ignore this email.`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 40px; border: 1px solid #eef2f6; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #2d3748; text-align: center;">CalmPrep AI</h2>
                <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px; color: #4a5568; text-align: center;">
                    Use the code below to sign in to your account.
                </p>
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; padding: 20px 40px; background-color: #f7fafc; border: 2px dashed #3182ce; border-radius: 12px;">
                        <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #2d3748; font-family: 'Courier New', monospace;">${otpCode}</span>
                    </div>
                </div>
                <p style="font-size: 14px; line-height: 20px; color: #718096; text-align: center; margin-bottom: 8px;">
                    This code expires in <strong>10 minutes</strong>.
                </p>
                <p style="font-size: 14px; line-height: 20px; color: #718096; text-align: center; margin-bottom: 24px;">
                    If you did not request this code, you can safely ignore this email.
                </p>
                <div style="border-top: 1px solid #edf2f7; padding-top: 24px; font-size: 12px; color: #a0aec0; text-align: center;">
                    &copy; ${new Date().getFullYear()} CalmPrep AI. Secure Passwordless Authentication.
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email Sending Error:', error);
        throw new Error('Failed to send OTP email');
    }
};
