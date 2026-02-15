import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    extractedText: {
        type: String,
        required: true,
    },
    units: [{
        unitNumber: Number,
        unitName: String,
        content: String,
        importantTopics: [{
            text: String,
            importance: {
                type: String,
                enum: ['high', 'medium', 'low'],
            },
            startIndex: Number,
            endIndex: Number,
        }],
        predictedQuestions: [{
            question: String,
            marks: {
                type: Number,
                enum: [2, 5, 10],
            },
            guidance: {
                howToStart: String,
                keyPoints: [String],
                expectedLength: String,
                keywords: [String],
            },
        }],
        studyGuidance: {
            twoMark: {
                expectedLines: String,
                keywords: [String],
            },
            fiveMark: {
                expectedPoints: String,
                diagramNeeded: Boolean,
                explanation: String,
            },
            tenMark: {
                structure: String,
                minimumLength: String,
                mustInclude: [String],
            },
        },
    }],
    analyzed: {
        type: Boolean,
        default: false,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const PDF = mongoose.model('PDF', pdfSchema);

export default PDF;
