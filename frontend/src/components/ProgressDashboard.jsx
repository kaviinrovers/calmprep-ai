import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchProgressData();
    }, []);

    const fetchProgressData = async () => {
        try {
            const [summaryRes, historyRes] = await Promise.all([
                axios.get('/api/progress/summary'),
                axios.get('/api/progress/history'),
            ]);

            setSummary(summaryRes.data.summary);
            setHistory(historyRes.data.reports);
        } catch (err) {
            console.error('Failed to fetch progress:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="card text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading your progress...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card">
                <h2 className="text-2xl font-bold gradient-text mb-2">
                    📊 Your Study Progress
                </h2>
                <p className="text-gray-600">
                    Track your journey and see how exam-ready you are
                </p>
            </div>

            {/* Overall Summary */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                        <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
                        <div className="text-3xl font-bold text-primary">
                            {summary.totalSessions}
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-50 to-green-100">
                        <div className="text-sm text-gray-600 mb-1">Time Spent</div>
                        <div className="text-3xl font-bold text-success">
                            {formatDuration(summary.totalTimeSpent)}
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                        <div className="text-sm text-gray-600 mb-1">Average Progress</div>
                        <div className="text-3xl font-bold text-purple-600">
                            {summary.averageProgress}%
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
                        <div className="text-sm text-gray-600 mb-1">Focus Score</div>
                        <div className="text-3xl font-bold text-warning">
                            {summary.averageFocusScore}%
                        </div>
                    </div>
                </div>
            )}

            {/* Exam Readiness */}
            {summary && (
                <div className="card">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        🎯 Am I Exam Ready?
                    </h3>

                    <div
                        className={`p-6 rounded-xl text-center ${summary.examReady
                                ? 'bg-gradient-to-r from-green-100 to-green-200'
                                : 'bg-gradient-to-r from-yellow-100 to-orange-200'
                            }`}
                    >
                        <div className="text-5xl mb-3">
                            {summary.examReady ? '🎉' : '📚'}
                        </div>
                        <p className="text-xl font-bold text-gray-800 mb-2">
                            {summary.recommendation}
                        </p>

                        {!summary.examReady && (
                            <div className="mt-4 text-sm text-gray-700">
                                <p>💡 Keep studying consistently to improve your readiness</p>
                                <p>✅ Aim for 75%+ average progress with at least 3 study sessions</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Study History */}
            <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    📖 Study Session History
                </h3>

                {history.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No study sessions recorded yet</p>
                        <p className="text-sm mt-2">Start studying to see your progress here!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((report) => (
                            <div
                                key={report._id}
                                className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all cursor-pointer"
                                onClick={() => setSelectedReport(report)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">
                                            {report.pdfId?.originalName || 'Study Session'}
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {formatDate(report.sessionDate)}
                                        </p>

                                        <div className="flex gap-4 mt-2 text-sm">
                                            <span className="text-gray-600">
                                                ⏱️ {formatDuration(report.duration)}
                                            </span>
                                            <span className="text-gray-600">
                                                📚 {report.unitsCovered.length} units
                                            </span>
                                            <span className="text-gray-600">
                                                ✅ {report.questionsCorrect}/{report.questionsAttempted} correct
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">
                                            {report.overallProgress}%
                                        </div>
                                        <div className="text-xs text-gray-500">Progress</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-primary to-purple-600 h-full rounded-full transition-all"
                                        style={{ width: `${report.overallProgress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Report Details Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedReport(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>

                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Session Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-semibold">{formatDate(selectedReport.sessionDate)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Duration</p>
                                <p className="font-semibold">{formatDuration(selectedReport.duration)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Overall Progress</p>
                                <p className="text-2xl font-bold text-primary">
                                    {selectedReport.overallProgress}%
                                </p>
                            </div>

                            {selectedReport.unitsCovered.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Units Covered</p>
                                    <div className="space-y-2">
                                        {selectedReport.unitsCovered.map((unit, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">
                                                        {unit.unitName || `Unit ${unit.unitNumber}`}
                                                    </span>
                                                    <span className="text-primary">
                                                        {unit.completionPercentage}%
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {formatDuration(unit.timeSpent)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedReport.strongAreas.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">💪 Strong Areas</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedReport.strongAreas.map((area, idx) => (
                                            <span key={idx} className="badge-high">
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedReport.weakAreas.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">📚 Needs Improvement</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedReport.weakAreas.map((area, idx) => (
                                            <span key={idx} className="badge-medium">
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedReport.notes && (
                                <div>
                                    <p className="text-sm text-gray-600">Notes</p>
                                    <p className="text-gray-700">{selectedReport.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressDashboard;
