import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, language } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password',
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            language: language || 'english',
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                language: user.language,
                isPremium: user.isPremium,
            },
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup',
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Check user exists and get password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                language: user.language,
                isPremium: user.isPremiumActive(),
                premiumExpiryDate: user.premiumExpiryDate,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
import { protect } from '../middleware/auth.js';

router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                language: req.user.language,
                isPremium: req.user.isPremiumActive(),
                premiumExpiryDate: req.user.premiumExpiryDate,
            },
        });
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user',
        });
    }
});

// @route   PUT /api/auth/language
// @desc    Update user language preference
// @access  Private
router.put('/language', protect, async (req, res) => {
    try {
        const { language } = req.body;

        if (!['english', 'tamil', 'mixed'].includes(language)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language. Must be: english, tamil, or mixed',
            });
        }

        req.user.language = language;
        await req.user.save();

        res.json({
            success: true,
            message: 'Language preference updated',
            language,
        });
    } catch (error) {
        console.error('Update Language Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating language',
        });
    }
});

export default router;
