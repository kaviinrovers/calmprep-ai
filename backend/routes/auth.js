import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import supabase from '../config/supabase.js';
import { sendOTPEmail } from '../utils/emailService.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Generate 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

/**
 * @route   POST /api/auth/send-otp
 * @desc    Generate and email a 6-digit OTP
 */
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTPs for this email
        await supabase.from('email_otps').delete().eq('email', email);

        // Store OTP
        const { error } = await supabase
            .from('email_otps')
            .insert([{ email, otp_code: otpCode, expires_at: expiresAt.toISOString() }]);

        if (error) throw error;

        // Send Email
        await sendOTPEmail(email, otpCode);

        res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP code and log user in
 */
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        // Find matching OTP
        const { data: record, error } = await supabase
            .from('email_otps')
            .select('*')
            .eq('email', email)
            .eq('otp_code', otp)
            .eq('used', false)
            .single();

        if (error || !record) {
            return res.status(400).json({ success: false, message: 'Invalid OTP code' });
        }

        // Check expiry
        if (new Date(record.expires_at) < new Date()) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        // Mark as used
        await supabase.from('email_otps').update({ used: true }).eq('id', record.id);

        // Find or Create User
        let { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (!user) {
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{
                    email,
                    name: email.split('@')[0],
                    is_premium: false
                }])
                .select()
                .single();

            if (createError) throw createError;
            user = newUser;
        }

        const jwtToken = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login successful',
            token: jwtToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isPremium: user.is_premium
            }
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ success: false, message: 'Authentication failed' });
    }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                language: req.user.language,
                isPremium: req.user.is_premium,
                premiumExpiryDate: req.user.premium_expiry,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update language preference
router.put('/language', protect, async (req, res) => {
    try {
        const { language } = req.body;
        if (!['english', 'tamil', 'mixed'].includes(language)) {
            return res.status(400).json({ success: false, message: 'Invalid language' });
        }
        const { error } = await supabase
            .from('users')
            .update({ language })
            .eq('id', req.user.id);
        if (error) throw error;
        res.json({ success: true, message: 'Language updated', language });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
