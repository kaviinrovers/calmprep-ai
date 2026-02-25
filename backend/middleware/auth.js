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
            // Verify token with Supabase Auth
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

            if (authError || !authUser) {
                return res.status(401).json({ success: false, message: 'Invalid or expired token' });
            }

            // Sync with our local users table (profiles)
            let { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', authUser.email)
                .single();

            // If user doesn't exist in our profile table, create them
            if (error || !user) {
                console.log(`Creating new profile for ${authUser.email}...`);
                const { data: newUser, error: createError } = await supabase
                    .from('users')
                    .insert([
                        {
                            id: authUser.id, // Use the same UUID from Supabase Auth
                            email: authUser.email,
                            name: authUser.email.split('@')[0], // Default name from email
                            language: 'english',
                            is_premium: false
                        }
                    ])
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating user profile:', createError);
                    return res.status(500).json({ success: false, message: 'Failed to create user profile' });
                }
                user = newUser;
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
