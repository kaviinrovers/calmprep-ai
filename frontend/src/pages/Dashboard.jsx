import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Components
import PDFUpload from '../components/PDFUpload';
import StudyView from '../components/StudyView';
import ProgressDashboard from '../components/ProgressDashboard';
import VoiceAssistant from '../components/VoiceAssistant';
import PremiumModal from '../components/PremiumModal';

const Dashboard = () => {
    const { user, logout, isPremium } = useAuth();
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [activeTab, setActiveTab] = useState('study');

    return (
        <div className="min-h-screen">
            {/* Top Navigation */}
            <nav className="glass border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold gradient-text">CalmPrep AI</h1>

                            <div className="hidden md:flex space-x-4">
                                <button
                                    onClick={() => setActiveTab('study')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'study'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    📚 Study
                                </button>
                                <button
                                    onClick={() => setActiveTab('progress')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'progress'
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    📊 Progress
                                </button>
                                {isPremium && (
                                    <button
                                        onClick={() => setActiveTab('voice')}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'voice'
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        🎙️ Voice Assistant
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {!isPremium && (
                                <button
                                    onClick={() => setShowPremiumModal(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    ⭐ Upgrade to Premium
                                </button>
                            )}

                            {isPremium && (
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-full text-sm">
                                    ⭐ Premium
                                </span>
                            )}

                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="font-semibold text-gray-800">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.language}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-gray-600 hover:text-danger font-semibold"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'study' && <StudyView />}
                {activeTab === 'progress' && <ProgressDashboard />}
                {activeTab === 'voice' && isPremium && <VoiceAssistant />}
            </div>

            {/* Premium Modal */}
            {showPremiumModal && (
                <PremiumModal onClose={() => setShowPremiumModal(false)} />
            )}
        </div>
    );
};

export default Dashboard;
