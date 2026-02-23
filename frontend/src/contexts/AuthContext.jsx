import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Configure axios defaults
    axios.defaults.baseURL = API_URL;
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Load user on mount and listen to auth changes
    useEffect(() => {
        // Initial check
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                const newToken = session.access_token;
                localStorage.setItem('token', newToken);
                setToken(newToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                await fetchUser();
            } else if (event === 'SIGNED_OUT') {
                logout();
            }
        });

        return () => subscription.unsubscribe();
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateLanguage = async (language) => {
        const response = await axios.put('/api/auth/language', { language });
        setUser({ ...user, language });
        return response.data;
    };

    const value = {
        user,
        setUser,
        loading,
        logout,
        updateLanguage,
        isAuthenticated,
        setIsAuthenticated,
        isPremium: user?.isPremium || false,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
