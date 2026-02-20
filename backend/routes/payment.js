import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';
import supabase from '../config/supabase.js';

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
    try {
        const options = {
            amount: 9900,
            currency: 'INR',
            receipt: `receipt_${req.user.id}_${Date.now()}`,
            notes: { userId: req.user.id, plan: 'Premium' },
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
        res.status(500).json({ success: false, message: 'Order creation failed' });
    }
});

// @route POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;

        const body = orderId + '|' + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        // Save subscription
        const { error: subError } = await supabase
            .from('subscriptions')
            .insert([{
                user_id: req.user.id,
                razorpay_order_id: orderId,
                razorpay_payment_id: paymentId,
                razorpay_signature: signature,
                amount: 9900,
                status: 'completed'
            }]);

        if (subError) throw subError;

        // Update user
        const { error: userError } = await supabase
            .from('users')
            .update({
                is_premium: true,
                premium_expiry: expiryDate.toISOString()
            })
            .eq('id', req.user.id);

        if (userError) throw userError;

        res.json({
            success: true,
            message: 'Premium activated!',
            isPremium: true,
            expiryDate,
        });
    } catch (error) {
        console.error('Payment Verify Error:', error);
        res.status(500).json({ success: false, message: 'Verification failed' });
    }
});

// @route GET /api/payment/status
router.get('/status', protect, async (req, res) => {
    try {
        const isPremium = req.user.is_premium;
        const expiryDate = new Date(req.user.premium_expiry);
        const now = new Date();

        const isActive = isPremium && expiryDate > now;
        const daysLeft = isActive ? Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)) : 0;

        res.json({
            success: true,
            isPremium: isActive,
            expiryDate: req.user.premium_expiry,
            daysLeft,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Status check failed' });
    }
});

export default router;
