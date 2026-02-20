import React, { useState } from 'react';
import axios from 'axios';

const PDFUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                setError('');
            } else {
                setError('Please upload a PDF file');
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
                setError('');
            } else {
                setError('Please upload a PDF file');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a PDF file first');
            return;
        }

        setUploading(true);
        setError('');

        try {
            // Upload PDF
            const formData = new FormData();
            formData.append('pdf', file);

            const uploadResponse = await axios.post('/api/pdf/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const pdfId = uploadResponse.data.pdfId;

            // Analyze PDF
            setUploading(false);
            setAnalyzing(true);

            const analyzeResponse = await axios.post(`/api/pdf/analyze/${pdfId}`);

            setAnalyzing(false);
            onUploadSuccess({
                pdfId,
                pdfName: file.name,
                units: analyzeResponse.data.units,
            });

            // Reset
            setFile(null);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload and analyze PDF');
            setUploading(false);
            setAnalyzing(false);
        }
    };

    return (
        <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 Upload Study Material</h2>
            <p className="text-gray-600 mb-6">
                Upload your syllabus, notes, or textbook PDF for Smart analysis
            </p>

            {/* Drag & Drop Zone */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-300 hover:border-primary'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {!file ? (
                    <div>
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                            Drag and drop your PDF here
                        </p>
                        <p className="text-gray-500 mb-4">or</p>
                        <label className="btn-secondary cursor-pointer">
                            Choose File
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                ) : (
                    <div>
                        <div className="inline-flex items-center px-6 py-3 bg-green-50 rounded-lg mb-4">
                            <svg
                                className="h-6 w-6 text-success mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-semibold text-gray-800">{file.name}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                            onClick={() => setFile(null)}
                            className="text-danger hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-danger text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {file && !uploading && !analyzing && (
                <button onClick={handleUpload} className="w-full btn-primary mt-6">
                    Upload and Analyze
                </button>
            )}

            {(uploading || analyzing) && (
                <div className="mt-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3"></div>
                    <p className="text-gray-700 font-semibold">
                        {uploading ? '📤 Uploading PDF...' : '🤖 Analyzing your content...'}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">This may take a minute</p>
                </div>
            )}
        </div>
    );
};

export default PDFUpload;
