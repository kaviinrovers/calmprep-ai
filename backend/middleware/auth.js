import jwt from 'jsonwebtoken';
import supabase from '../config/supabase.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', decoded.id)
                .single();

            if (error || !user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Token failed' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Auth error' });
    }
};

// Check if user has premium access
export const premiumOnly = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Login required' });
    }

    if (!req.user.is_premium) {
        return res.status(403).json({ success: false, message: 'Premium required', isPremium: false });
    }

    next();
};
