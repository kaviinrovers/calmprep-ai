import React, { useState } from 'react';

const UnitAnalysis = ({ unit }) => {
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const getImportanceIcon = (importance) => {
        switch (importance) {
            case 'high':
                return '⭐';
            case 'medium':
                return '⚠️';
            case 'low':
                return '⛔';
            default:
                return '';
        }
    };

    const getImportanceBadgeClass = (importance) => {
        switch (importance) {
            case 'high':
                return 'badge-high';
            case 'medium':
                return 'badge-medium';
            case 'low':
                return 'badge-low';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Unit Header */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {unit.unitName || `Unit ${unit.unitNumber}`}
                </h2>
                <p className="text-gray-600">
                    Smart analysis with important topics, predicted questions, and study guidance
                </p>
            </div>

            {/* Important Topics */}
            <div className="card">
                <button
                    onClick={() => toggleSection('topics')}
                    className="w-full flex justify-between items-center"
                >
                    <h3 className="text-xl font-bold text-gray-800">
                        📌 Important Topics
                    </h3>
                    <span className="text-2xl text-primary">
                        {expandedSection === 'topics' ? '−' : '+'}
                    </span>
                </button>

                {expandedSection === 'topics' && (
                    <div className="mt-6 space-y-3">
                        {unit.importantTopics && unit.importantTopics.length > 0 ? (
                            unit.importantTopics.map((topic, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 bg-gray-50 rounded-lg border-l-4 hover:shadow-md transition-all"
                                    style={{
                                        borderColor:
                                            topic.importance === 'high'
                                                ? '#10B981'
                                                : topic.importance === 'medium'
                                                    ? '#F59E0B'
                                                    : '#9CA3AF',
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{topic.text}</p>
                                            {topic.reason && (
                                                <p className="text-sm text-gray-600 mt-1">{topic.reason}</p>
                                            )}
                                        </div>
                                        <span className={getImportanceBadgeClass(topic.importance)}>
                                            {getImportanceIcon(topic.importance)} {topic.importance}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No topics identified yet</p>
                        )}
                    </div>
                )}
            </div>

            {/* Predicted Questions */}
            <div className="card">
                <button
                    onClick={() => toggleSection('questions')}
                    className="w-full flex justify-between items-center"
                >
                    <h3 className="text-xl font-bold text-gray-800">
                        ❓ Predicted Exam Questions
                    </h3>
                    <span className="text-2xl text-primary">
                        {expandedSection === 'questions' ? '−' : '+'}
                    </span>
                </button>

                {expandedSection === 'questions' && (
                    <div className="mt-6">
                        {/* Group by marks */}
                        {[2, 5, 10].map((marks) => {
                            const questions = unit.predictedQuestions?.filter(
                                (q) => q.marks === marks
                            );

                            if (!questions || questions.length === 0) return null;

                            return (
                                <div key={marks} className="mb-6">
                                    <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                                        <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm mr-2">
                                            {marks} MARK
                                        </span>
                                        {questions.length} Questions
                                    </h4>

                                    <div className="space-y-3">
                                        {questions.map((q, idx) => (
                                            <div key={idx} className="p-4 bg-blue-50 rounded-lg">
                                                <p className="font-semibold text-gray-800 mb-2">
                                                    {idx + 1}. {q.question}
                                                </p>

                                                {q.guidance && (
                                                    <div className="mt-3 p-3 bg-white rounded-lg text-sm">
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">How to start:</span>{' '}
                                                            {q.guidance.howToStart}
                                                        </p>
                                                        {q.guidance.keyPoints && (
                                                            <div className="mt-2">
                                                                <span className="font-semibold">Key points:</span>
                                                                <ul className="list-disc list-inside ml-2 mt-1">
                                                                    {q.guidance.keyPoints.map((point, i) => (
                                                                        <li key={i} className="text-gray-600">
                                                                            {point}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        <p className="text-gray-600 mt-2">
                                                            <span className="font-semibold">Expected:</span>{' '}
                                                            {q.guidance.expectedLength}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Study Guidance */}
            {unit.studyGuidance && (
                <div className="card">
                    <button
                        onClick={() => toggleSection('guidance')}
                        className="w-full flex justify-between items-center"
                    >
                        <h3 className="text-xl font-bold text-gray-800">
                            📖 Marks-Wise Study Guidance
                        </h3>
                        <span className="text-2xl text-primary">
                            {expandedSection === 'guidance' ? '−' : '+'}
                        </span>
                    </button>

                    {expandedSection === 'guidance' && (
                        <div className="mt-6 space-y-4">
                            {/* 2 Mark */}
                            {unit.studyGuidance.twoMark && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <h4 className="font-bold text-green-800 mb-2">2 MARK Questions</h4>
                                    <p className="text-gray-700">
                                        <strong>Lines:</strong> {unit.studyGuidance.twoMark.expectedLines}
                                    </p>
                                    {unit.studyGuidance.twoMark.keywords && (
                                        <p className="text-gray-700 mt-1">
                                            <strong>Must-have keywords:</strong>{' '}
                                            {unit.studyGuidance.twoMark.keywords.join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* 5 Mark */}
                            {unit.studyGuidance.fiveMark && (
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <h4 className="font-bold text-yellow-800 mb-2">5 MARK Questions</h4>
                                    <p className="text-gray-700">
                                        <strong>Points:</strong> {unit.studyGuidance.fiveMark.expectedPoints}
                                    </p>
                                    <p className="text-gray-700 mt-1">
                                        <strong>Diagram needed:</strong>{' '}
                                        {unit.studyGuidance.fiveMark.diagramNeeded ? 'Yes' : 'No'}
                                    </p>
                                    {unit.studyGuidance.fiveMark.explanation && (
                                        <p className="text-gray-700 mt-1">
                                            <strong>Tip:</strong> {unit.studyGuidance.fiveMark.explanation}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* 10 Mark */}
                            {unit.studyGuidance.tenMark && (
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <h4 className="font-bold text-purple-800 mb-2">10 MARK Questions</h4>
                                    <p className="text-gray-700">
                                        <strong>Structure:</strong> {unit.studyGuidance.tenMark.structure}
                                    </p>
                                    <p className="text-gray-700 mt-1">
                                        <strong>Minimum length:</strong>{' '}
                                        {unit.studyGuidance.tenMark.minimumLength}
                                    </p>
                                    {unit.studyGuidance.tenMark.mustInclude && (
                                        <div className="mt-2">
                                            <strong>Must include:</strong>
                                            <ul className="list-disc list-inside ml-2 mt-1">
                                                {unit.studyGuidance.tenMark.mustInclude.map((item, i) => (
                                                    <li key={i} className="text-gray-600">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UnitAnalysis;
