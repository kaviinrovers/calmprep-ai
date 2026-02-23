import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BookIntro from '../components/BookIntro';
import { supabase } from '../lib/supabase';

const Login = () => {
    const navigate = useNavigate();
    const { setUser, setIsAuthenticated } = useAuth();

    const [introComplete, setIntroComplete] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState('email'); // 'email' or 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const otpRefs = useRef([]);

    // Cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    // Auto-focus first OTP input when step changes
    useEffect(() => {
        if (step === 'otp' && otpRefs.current[0]) {
            otpRefs.current[0].focus();
        }
    }, [step]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                }
            });

            if (error) throw error;

            setStep('otp');
            setMessage('A 6-digit code has been sent to your email.');
            setCooldown(60);
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOTPKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOTPPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            otpRefs.current[5]?.focus();
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'email',
            });

            if (error) throw error;

            if (data?.session) {
                const { access_token } = data.session;
                localStorage.setItem('token', access_token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

                // Fetch user profile from our backend to sync
                const response = await axios.get('/api/auth/me');
                setUser(response.data.user);
                setIsAuthenticated(true);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.');
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (cooldown > 0) return;
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;

            setMessage('A new code has been sent to your email.');
            setCooldown(60);
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } catch (err) {
            setError(err.message || 'Failed to resend OTP.');
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {step === 'email' ? 'Welcome to CalmPrep AI' : 'Enter Verification Code'}
                            </h2>
                            <p className="text-gray-600">
                                {step === 'email'
                                    ? 'Enter your email to receive a login code'
                                    : `We sent a 6-digit code to ${email}`
                                }
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-800 text-sm rounded-xl">
                                {message}
                            </div>
                        )}

                        {step === 'email' ? (
                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white py-4 px-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Send Login Code'}
                                </button>

                                <div className="text-center text-xs text-gray-500 pt-4">
                                    By signing in, you agree to our Terms and Privacy Policy.
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                {/* OTP Input Boxes */}
                                <div className="flex justify-center gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (otpRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOTPChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                            onPaste={index === 0 ? handleOTPPaste : undefined}
                                            className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.join('').length !== 6}
                                    className="w-full bg-primary text-white py-4 px-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                                </button>

                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        type="button"
                                        onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']); setError(''); setMessage(''); }}
                                        className="text-gray-500 hover:text-gray-700 font-medium"
                                    >
                                        ← Change email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={cooldown > 0 || loading}
                                        className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
                                    >
                                        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
