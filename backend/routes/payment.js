import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order for premium subscription
// @access  Private
router.post('/create-order', protect, async (req, res) => {
    try {
        const options = {
            amount: 9900, // ₹99 in paise
            currency: 'INR',
            receipt: `receipt_${req.user._id}_${Date.now()}`,
            notes: {
                userId: req.user._id.toString(),
                plan: 'Premium Monthly',
            },
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
        });
    }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment and activate premium
// @access  Private
router.post('/verify', protect, async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;

        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment details',
            });
        }

        // Verify signature
        const body = orderId + '|' + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === signature;

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Calculate expiry date (30 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        // Create subscription record
        await Subscription.create({
            user: req.user._id,
            orderId,
            paymentId,
            signature,
            amount: 9900,
            status: 'completed',
            expiresAt: expiryDate,
        });

        // Update user's premium status
        req.user.isPremium = true;
        req.user.premiumExpiryDate = expiryDate;
        await req.user.save();

        res.json({
            success: true,
            message: '🎉 Premium activated successfully! Enjoy voice assistant and study monitoring.',
            isPremium: true,
            expiryDate,
        });
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
        });
    }
});

// @route   GET /api/payment/status
// @desc    Check premium subscription status
// @access  Private
router.get('/status', protect, async (req, res) => {
    try {
        const isPremiumActive = req.user.isPremiumActive();

        res.json({
            success: true,
            isPremium: isPremiumActive,
            expiryDate: req.user.premiumExpiryDate,
            daysLeft: isPremiumActive
                ? Math.ceil((req.user.premiumExpiryDate - new Date()) / (1000 * 60 * 60 * 24))
                : 0,
        });
    } catch (error) {
        console.error('Get Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check subscription status',
        });
    }
});

export default router;
