import React, { useState } from 'react';
import PDFUpload from './PDFUpload';
import UnitAnalysis from './UnitAnalysis';
import AnswerGenerator from './AnswerGenerator';

const StudyView = () => {
    const [currentPDF, setCurrentPDF] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const handleUploadSuccess = (pdfData) => {
        setCurrentPDF(pdfData);
        if (pdfData.units && pdfData.units.length > 0) {
            setSelectedUnit(pdfData.units[0]);
        }
    };

    if (!currentPDF) {
        return (
            <div>
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome to Your Study Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Upload your study material to get started with Smart exam preparation
                    </p>
                </div>
                <PDFUpload onUploadSuccess={handleUploadSuccess} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Units */}
            <div className="lg:col-span-1">
                <div className="card sticky top-20">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">📚 Units</h3>
                    <p className="text-sm text-gray-600 mb-4">{currentPDF.pdfName}</p>

                    <div className="space-y-2">
                        {currentPDF.units.map((unit) => (
                            <button
                                key={unit.unitNumber}
                                onClick={() => setSelectedUnit(unit)}
                                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${selectedUnit?.unitNumber === unit.unitNumber
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <div>{unit.unitName || `Unit ${unit.unitNumber}`}</div>
                                <div className="text-xs opacity-75 mt-1">
                                    {unit.predictedQuestions?.length || 0} questions
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPDF(null)}
                        className="w-full mt-4 px-4 py-2 text-danger hover:bg-red-50 rounded-lg font-semibold transition-all"
                    >
                        Upload New PDF
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
                {selectedUnit && (
                    <>
                        <UnitAnalysis unit={selectedUnit} />
                        <AnswerGenerator pdfId={currentPDF.pdfId} unit={selectedUnit} />
                    </>
                )}
            </div>
        </div>
    );
};

export default StudyView;
