import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookIntro from '../components/BookIntro';
import { supabase } from '../lib/supabase';

const Login = () => {
    const navigate = useNavigate();
    const { setUser, setIsAuthenticated, isAuthenticated } = useAuth();

    const [introComplete, setIntroComplete] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Safety net: Auto-redirect if already authenticated
    useEffect(() => {
        if (introComplete && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate, introComplete]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            if (data?.session) {
                setUser(data.user);
                setIsAuthenticated(true);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError(err.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Book intro animation overlay */}
            <BookIntro onComplete={() => setIntroComplete(true)} />

            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
                <div className={`sm:mx-auto sm:w-full sm:max-w-md ${introComplete ? 'login-reveal' : 'opacity-0'}`}>
                    <div className="bg-white py-10 px-8 shadow-sm rounded-2xl border border-gray-100">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                            <p className="text-gray-600">Sign in to your CalmPrep account</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-4 px-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                                {loading ? 'Checking...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-8 text-center border-top pt-6 border-gray-100">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-primary font-bold hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
