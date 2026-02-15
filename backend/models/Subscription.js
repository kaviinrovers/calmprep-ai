import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true, // in paise (9900 for ₹99)
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    activatedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
