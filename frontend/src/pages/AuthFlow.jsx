import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AuthFlow = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // We'll manually login after reset

    // Steps: email -> otp -> password
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verificationToken, setVerificationToken] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/send-otp', { email });
            setMessage(response.data.message);
            setStep('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/verify-otp', { email, otp });
            setVerificationToken(response.data.verificationToken);
            setStep('password');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/reset-password', {
                email,
                verificationToken,
                newPassword
            });

            // The response returns the JWT token and user
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Refresh page to trigger AuthContext update or just navigate
            alert('🎉 Security updated successfully! Welcome to CampRep AI.');
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">CampRep AI</h1>
                    <p className="text-gray-600">Secure Access Portal</p>
                </div>

                <div className="card shadow-xl p-8">
                    {/* Step Headers */}
                    <div className="flex justify-between mb-8">
                        {['email', 'otp', 'password'].map((s, idx) => (
                            <div key={s} className="flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === s ? 'bg-primary text-white scale-110 shadow-lg' :
                                        (idx < ['email', 'otp', 'password'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500')
                                    }`}>
                                    {idx < ['email', 'otp', 'password'].indexOf(step) ? '✓' : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-1 uppercase font-bold tracking-wider ${step === s ? 'text-primary' : 'text-gray-400'
                                    }`}>
                                    {s}
                                </span>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-danger text-red-700 rounded-lg animate-shake">
                            <p className="font-semibold">Security Alert</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {message && step === 'otp' && !error && (
                        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-primary text-blue-700 rounded-lg">
                            <p className="text-sm">{message}</p>
                        </div>
                    )}

                    {/* STEP 1: Email Entry */}
                    {step === 'email' && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h2>
                                <p className="text-gray-500 text-sm mb-6">Enter your email to receive a secure verification code.</p>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg"
                            >
                                {loading ? 'Sending code...' : 'Send Verification Code'}
                            </button>
                            <div className="text-center">
                                <Link to="/login" className="text-primary hover:underline text-sm font-semibold">Back to Login</Link>
                            </div>
                        </form>
                    )}

                    {/* STEP 2: OTP Entry */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Email</h2>
                                <p className="text-gray-500 text-sm mb-6">We've sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.</p>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">6-Digit Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    pattern="\d{6}"
                                    className="input-field text-center text-3xl tracking-[15px] font-bold"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full btn-primary py-4 text-lg"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="text-gray-500 hover:text-primary text-sm transition-colors"
                                >
                                    Change Email
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3: Password Reset/Set */}
                    {step === 'password' && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Password</h2>
                                <p className="text-gray-500 text-sm mb-6">Finalize your account security for <strong>{email}</strong>.</p>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || newPassword.length < 6}
                                className="w-full btn-primary py-4 text-lg"
                            >
                                {loading ? 'Setting password...' : 'Complete & Log In'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-8 flex items-center justify-center space-x-4 opacity-50 grayscale">
                    <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Secure" className="h-4" />
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span className="text-xs uppercase font-bold tracking-widest text-gray-500">Secure Protocol</span>
                </div>
            </div>
        </div>
    );
};

export default AuthFlow;
