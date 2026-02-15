import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Configure axios defaults
    axios.defaults.baseURL = API_URL;
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Load user on mount
    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setToken(token);
        setUser(user);

        return response.data;
    };

    const signup = async (name, email, password, language) => {
        const response = await axios.post('/api/auth/signup', {
            name,
            email,
            password,
            language,
        });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setToken(token);
        setUser(user);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    const updateLanguage = async (language) => {
        const response = await axios.put('/api/auth/language', { language });
        setUser({ ...user, language });
        return response.data;
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        updateLanguage,
        isAuthenticated: !!user,
        isPremium: user?.isPremium || false,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
