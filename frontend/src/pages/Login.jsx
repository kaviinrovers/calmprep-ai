import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">CalmPrep</h1>
                    <p className="text-gray-600">Your stress-free exam companion</p>
                </div>

                {/* Login Card */}
                <div className="card">
                    <div className="mb-6">
                        <Link
                            to="/verify"
                            className="w-full flex items-center justify-center space-x-2 py-4 px-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
                        >
                            <span>📥</span>
                            <span>Sign in with Email code</span>
                        </Link>
                        <p className="text-center text-xs text-gray-500 mt-2">Preferred for all users</p>
                    </div>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium">or use password</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Link to="/verify" className="text-sm font-semibold text-primary hover:underline">
                                Login with Email OTP / Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
                    <p>✨ Smart exam preparation</p>
                    <p>📚 Unit-wise PDF analysis</p>
                    <p>🎙️ Voice assistant (Premium)</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
