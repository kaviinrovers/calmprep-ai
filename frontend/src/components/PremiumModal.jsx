import React, { useState } from 'react';
import axios from 'axios';

const PremiumModal = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpay();
            if (!scriptLoaded) {
                setError('Failed to load payment gateway. Please check your connection.');
                setLoading(false);
                return;
            }

            // Create order
            const orderResponse = await axios.post('/api/payment/create-order');
            const { orderId, amount, currency, keyId } = orderResponse.data;

            // Razorpay options
            const options = {
                key: keyId,
                amount,
                currency,
                name: 'CalmPrep',
                description: 'Premium Monthly Subscription',
                order_id: orderId,
                handler: async (response) => {
                    try {
                        // Verify payment
                        await axios.post('/api/payment/verify', {
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        });

                        alert('🎉 Premium activated successfully! Reload the page to access premium features.');
                        window.location.reload();
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                },
                theme: {
                    color: '#3B82F6',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                >
                    ×
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold gradient-text mb-2">
                        ⭐ Upgrade to Premium
                    </h2>
                    <p className="text-gray-600">Unlock powerful features for honest exam preparation</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-success">✓</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">🎙️ Voice Assistant</h3>
                            <p className="text-gray-600 text-sm">
                                Talk to Smart tutor, get verbal explanations, and practice viva
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-success">✓</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">👁️ Study Monitoring</h3>
                            <p className="text-gray-600 text-sm">
                                Gentle focus reminders to keep you on track (non-punitive)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-success">✓</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">📊 Advanced Analytics</h3>
                            <p className="text-gray-600 text-sm">
                                Detailed progress reports and exam-readiness predictions
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-success">✓</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">🌍 Multi-Language Support</h3>
                            <p className="text-gray-600 text-sm">
                                Full support for English, Tamil, and mixed languages
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 text-center">
                    <div className="text-4xl font-bold text-gray-800 mb-2">₹99</div>
                    <div className="text-gray-600">per month</div>
                    <div className="text-sm text-gray-500 mt-2">Cancel anytime • Secure payment via Razorpay</div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-danger text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
                >
                    {loading ? 'Processing...' : '🔒 Pay ₹99 & Activate Premium'}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                    Powered by Razorpay • 100% Secure Payments
                </p>
            </div>
        </div>
    );
};

export default PremiumModal;
