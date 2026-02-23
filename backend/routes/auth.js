import express from 'express';
import supabase from '../config/supabase.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
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

/**
 * @route   PUT /api/auth/language
 * @desc    Update language preference
 * @access  Private
 */
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
