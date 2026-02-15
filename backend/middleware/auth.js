import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.',
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found. Please login again.',
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or has expired. Please login again.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
        });
    }
};

// Check if user has premium access
export const premiumOnly = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login first',
            });
        }

        // Check if premium is active
        if (!req.user.isPremiumActive()) {
            return res.status(403).json({
                success: false,
                message: 'This feature requires premium subscription. Please upgrade to continue.',
                isPremium: false,
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error checking premium status',
        });
    }
};
