import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const VoiceAssistant = () => {
    const { user } = useAuth();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [conversation, setConversation] = useState([]);
    const [vivaMode, setVivaMode] = useState(false);
    const [vivaTopic, setVivaTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check for browser support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = user?.language === 'tamil' ? 'ta-IN' : 'en-IN';

            recognitionRef.current.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                setTranscript(speechResult);
                handleSpeechInput(speechResult);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }
    }, [user]);

    const requestPermissions = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermissionGranted(true);
        } catch (err) {
            alert('Microphone permission is required for voice assistant');
        }
    };

    const startListening = () => {
        if (recognitionRef.current && permissionGranted) {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            setIsListening(false);
            recognitionRef.current.stop();
        }
    };

    const handleSpeechInput = async (text) => {
        setLoading(true);

        try {
            const response = await axios.post('/api/voice/respond', {
                message: text,
                context: conversation.map(c => `${c.role}: ${c.text}`).join('\n'),
            });

            const aiText = response.data.response;
            setAiResponse(aiText);

            // Add to conversation
            setConversation(prev => [
                ...prev,
                { role: 'You', text },
                { role: 'AI', text: aiText },
            ]);

            // Speak the response
            speakText(aiText);
        } catch (err) {
            console.error('Voice response error:', err);
        } finally {
            setLoading(false);
            setIsListening(false);
        }
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = user?.language === 'tamil' ? 'ta-IN' : 'en-IN';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const startViva = async () => {
        if (!vivaTopic) {
            alert('Please enter a topic for viva');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/voice/viva', {
                topic: vivaTopic,
                difficulty: 'medium',
            });

            const question = response.data.question;
            setConversation(prev => [
                ...prev,
                { role: 'Viva Question', text: question },
            ]);
            speakText(question);
            setVivaMode(true);
        } catch (err) {
            console.error('Viva error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!permissionGranted) {
        return (
            <div className="card text-center">
                <div className="mb-6">
                    <div className="text-6xl mb-4">🎙️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Voice Assistant (Premium)
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Talk to your Smart tutor, practice viva, and get verbal explanations
                    </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-warning p-4 rounded-lg mb-6">
                    <p className="text-yellow-800">
                        🎤 We need microphone access to enable voice features
                    </p>
                </div>

                <button onClick={requestPermissions} className="btn-primary">
                    Grant Microphone Permission
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card">
                <h2 className="text-2xl font-bold gradient-text mb-2">
                    🎙️ Voice Assistant
                </h2>
                <p className="text-gray-600">
                    Your calm, patient Smart tutor - speak naturally and get helpful guidance
                </p>
            </div>

            {/* Viva Mode Toggle */}
            <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Viva Mode</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Enter topic for viva (e.g., Data Structures)"
                        className="input-field flex-1"
                        value={vivaTopic}
                        onChange={(e) => setVivaTopic(e.target.value)}
                    />
                    <button onClick={startViva} disabled={loading} className="btn-primary">
                        Start Viva
                    </button>
                </div>
            </div>

            {/* Conversation Display */}
            <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-4">💬 Conversation</h3>

                {conversation.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Click the microphone button to start talking with your Smart tutor</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {conversation.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-lg ${msg.role === 'You'
                                    ? 'bg-blue-100 ml-8'
                                    : msg.role === 'AI'
                                        ? 'bg-green-100 mr-8'
                                        : 'bg-yellow-100'
                                    }`}
                            >
                                <p className="font-semibold text-sm text-gray-600 mb-1">
                                    {msg.role === 'AI' ? 'Smart Tutor' : msg.role}
                                </p>
                                <p className="text-gray-800">{msg.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Voice Controls */}
            <div className="card text-center">
                {loading ? (
                    <div>
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-3"></div>
                        <p className="text-gray-600">Thinking...</p>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={isListening ? stopListening : startListening}
                            className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl transition-all transform ${isListening
                                ? 'bg-danger text-white scale-110 animate-pulse'
                                : 'bg-primary text-white hover:scale-105'
                                }`}
                        >
                            {isListening ? '⏸️' : '🎤'}
                        </button>

                        <p className="mt-4 text-gray-600 font-semibold">
                            {isListening ? 'Listening... Speak now' : 'Click to speak'}
                        </p>

                        {transcript && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-500">You said:</p>
                                <p className="text-gray-800 font-semibold">{transcript}</p>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={() => setConversation([])}
                    className="mt-6 px-4 py-2 text-danger hover:bg-red-50 rounded-lg"
                >
                    Clear Conversation
                </button>
            </div>
        </div>
    );
};

export default VoiceAssistant;
