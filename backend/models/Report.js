import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    pdfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDF',
        required: true,
    },
    sessionDate: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: Number, // in minutes
        required: true,
    },
    unitsCovered: [{
        unitNumber: Number,
        unitName: String,
        timeSpent: Number, // in minutes
        completionPercentage: Number,
    }],
    overallProgress: {
        type: Number, // percentage
        default: 0,
    },
    strongAreas: [String],
    weakAreas: [String],
    questionsAttempted: {
        type: Number,
        default: 0,
    },
    questionsCorrect: {
        type: Number,
        default: 0,
    },
    focusScore: {
        type: Number, // 0-100, from monitoring
        default: 100,
    },
    notes: {
        type: String,
        default: '',
    },
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
