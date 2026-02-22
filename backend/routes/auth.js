import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, language } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        // Check if user exists
        const { data: existingUser, error: searchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (searchError) {
            console.error('Database Search Error:', searchError);
            throw searchError;
        }

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([
                {
                    name,
                    email,
                    password_hash: hashedPassword,
                    language: language || 'english',
                    is_premium: false
                }
            ])
            .select()
            .single();

        if (error) throw error;

        const token = generateToken(newUser.id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                language: newUser.language,
                isPremium: newUser.is_premium
            },
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Get user from Supabase
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        // Check premium status
        const isPremiumActive = user.is_premium;
        // Note: You can add expiry check logic here if needed

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                language: user.language,
                isPremium: isPremiumActive,
                premiumExpiryDate: user.premium_expiry,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/auth/me
import { protect } from '../middleware/auth.js';

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

// @route   PUT /api/auth/language
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

import { sendOTPEmail } from '../utils/emailService.js';
import crypto from 'crypto';

// @route   POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTPs for this email
        await supabase.from('verification_otps').delete().eq('email', email);

        // Store OTP
        const { error } = await supabase
            .from('verification_otps')
            .insert([{ email, otp, expires_at: expiresAt.toISOString() }]);

        if (error) throw error;

        // Send Email
        await sendOTPEmail(email, otp);

        res.json({ success: true, message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send verification code' });
    }
});

// @route   POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and code are required' });

        const { data: record, error } = await supabase
            .from('verification_otps')
            .select('*')
            .eq('email', email)
            .eq('otp', otp)
            .single();

        if (error || !record) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        const now = new Date();
        if (new Date(record.expires_at) < now) {
            return res.status(400).json({ success: false, message: 'Code has expired' });
        }

        // Mark as verified
        await supabase
            .from('verification_otps')
            .update({ verified: true })
            .eq('id', record.id);

        // Generate a temporary verification token (simple hash for security)
        const verificationToken = crypto.createHash('sha256').update(email + otp + process.env.JWT_SECRET).digest('hex');

        res.json({
            success: true,
            message: 'Code verified successfully',
            verificationToken
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ success: false, message: 'Verification failed' });
    }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, verificationToken, newPassword } = req.body;
        if (!email || !verificationToken || !newPassword) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Verify the token manually to ensure it matches the verified record
        const { data: record, error: fetchError } = await supabase
            .from('verification_otps')
            .select('*')
            .eq('email', email)
            .eq('verified', true)
            .single();

        if (fetchError || !record) {
            return res.status(401).json({ success: false, message: 'Unauthorized password reset' });
        }

        const expectedToken = crypto.createHash('sha256').update(email + record.otp + process.env.JWT_SECRET).digest('hex');
        if (verificationToken !== expectedToken) {
            return res.status(401).json({ success: false, message: 'Invalid verification token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user (or create if magic link style signup)
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (user) {
            // Update existing user
            const { error: updateError } = await supabase
                .from('users')
                .update({ password_hash: hashedPassword })
                .eq('id', user.id);
            if (updateError) throw updateError;
        } else {
            // Create new user (Signup flow)
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{
                    email,
                    password_hash: hashedPassword,
                    name: email.split('@')[0], // Default name
                    is_premium: false
                }])
                .select()
                .single();
            if (createError) throw createError;
            user = newUser;
        }

        // Delete OTP records for this email
        await supabase.from('verification_otps').delete().eq('email', email);

        const token = generateToken(user.id);
        res.json({
            success: true,
            message: 'Password set successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isPremium: user.is_premium
            }
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ success: false, message: 'Failed to set password' });
    }
});

export default router;
