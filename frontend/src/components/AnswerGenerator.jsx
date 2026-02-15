import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AnswerGenerator = ({ pdfId, unit }) => {
    const { user } = useAuth();
    const [question, setQuestion] = useState('');
    const [marks, setMarks] = useState(2);
    const [language, setLanguage] = useState(user?.language || 'english');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }

        setLoading(true);
        setError('');
        setAnswer(null);

        try {
            const response = await axios.post('/api/questions/answer', {
                question,
                marks,
                pdfId,
                unitNumber: unit.unitNumber,
            });

            setAnswer(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate answer');
        } finally {
            setLoading(false);
        }
    };

    const languageOptions = {
        english: 'English',
        tamil: 'Tamil (தமிழ்)',
        mixed: 'Mixed (Tanglish)',
    };

    return (
        <div className="card">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                ✍️ Generate Exam-Ready Answer
            </h3>

            <div className="space-y-4">
                {/* Question Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter your question
                    </label>
                    <textarea
                        className="input-field min-h-[100px]"
                        placeholder="What is the main concept of...?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>

                {/* Marks and Language Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Marks
                        </label>
                        <select
                            className="input-field"
                            value={marks}
                            onChange={(e) => setMarks(parseInt(e.target.value))}
                        >
                            <option value={2}>2 Marks</option>
                            <option value={5}>5 Marks</option>
                            <option value={10}>10 Marks</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Answer Language
                        </label>
                        <select
                            className="input-field"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {Object.entries(languageOptions).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Generating Answer...' : 'Generate Answer'}
                </button>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-danger text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Answer Display */}
                {answer && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-primary">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-800 text-lg">
                                📝 Exam-Ready Answer ({answer.marks} Marks)
                            </h4>
                            <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold">
                                {languageOptions[answer.language]}
                            </span>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {answer.answer}
                            </p>
                        </div>

                        <p className="text-xs text-gray-500 mt-4 italic">{answer.source}</p>

                        {/* Copy Button */}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(answer.answer);
                                alert('Answer copied to clipboard!');
                            }}
                            className="mt-4 px-4 py-2 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-semibold"
                        >
                            📋 Copy Answer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnswerGenerator;
