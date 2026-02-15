import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false,
    },
    language: {
        type: String,
        enum: ['english', 'tamil', 'mixed'],
        default: 'english',
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    premiumExpiryDate: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if premium is active
userSchema.methods.isPremiumActive = function () {
    if (!this.isPremium) return false;
    if (!this.premiumExpiryDate) return false;
    return new Date() < this.premiumExpiryDate;
};

const User = mongoose.model('User', userSchema);

export default User;
