import express from 'express';
import { protect } from '../middleware/auth.js';
import Report from '../models/Report.js';
import PDF from '../models/PDF.js';

const router = express.Router();

// @route   POST /api/progress/session
// @desc    Save study session report
// @access  Private
router.post('/session', protect, async (req, res) => {
    try {
        const {
            pdfId,
            duration,
            unitsCovered,
            overallProgress,
            strongAreas,
            weakAreas,
            questionsAttempted,
            questionsCorrect,
            focusScore,
            notes,
        } = req.body;

        // Validation
        if (!pdfId || !duration) {
            return res.status(400).json({
                success: false,
                message: 'Please provide pdfId and duration',
            });
        }

        // Verify PDF exists
        const pdf = await PDF.findOne({ _id: pdfId, user: req.user._id });
        if (!pdf) {
            return res.status(404).json({
                success: false,
                message: 'PDF not found',
            });
        }

        // Create report
        const report = await Report.create({
            user: req.user._id,
            pdfId,
            duration,
            unitsCovered: unitsCovered || [],
            overallProgress: overallProgress || 0,
            strongAreas: strongAreas || [],
            weakAreas: weakAreas || [],
            questionsAttempted: questionsAttempted || 0,
            questionsCorrect: questionsCorrect || 0,
            focusScore: focusScore || 100,
            notes: notes || '',
        });

        res.status(201).json({
            success: true,
            message: 'Study session saved successfully',
            report,
        });
    } catch (error) {
        console.error('Save Session Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save study session',
        });
    }
});

// @route   GET /api/progress/history
// @desc    Get all study session reports
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user._id })
            .populate('pdfId', 'originalName')
            .sort({ sessionDate: -1 });

        res.json({
            success: true,
            count: reports.length,
            reports,
        });
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch study history',
        });
    }
});

// @route   GET /api/progress/unit/:pdfId/:unitNumber
// @desc    Get progress for specific unit
// @access  Private
router.get('/unit/:pdfId/:unitNumber', protect, async (req, res) => {
    try {
        const { pdfId, unitNumber } = req.params;

        const reports = await Report.find({
            user: req.user._id,
            pdfId,
        });

        // Filter reports that include this unit
        const unitReports = reports.filter(report =>
            report.unitsCovered.some(u => u.unitNumber === parseInt(unitNumber))
        );

        // Calculate unit progress
        let totalTimeSpent = 0;
        let avgCompletion = 0;

        unitReports.forEach(report => {
            const unit = report.unitsCovered.find(u => u.unitNumber === parseInt(unitNumber));
            if (unit) {
                totalTimeSpent += unit.timeSpent || 0;
                avgCompletion += unit.completionPercentage || 0;
            }
        });

        if (unitReports.length > 0) {
            avgCompletion = avgCompletion / unitReports.length;
        }

        res.json({
            success: true,
            unitNumber,
            sessionsCount: unitReports.length,
            totalTimeSpent,
            averageCompletion: avgCompletion.toFixed(2),
            reports: unitReports,
        });
    } catch (error) {
        console.error('Get Unit Progress Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch unit progress',
        });
    }
});

// @route   GET /api/progress/summary
// @desc    Get overall progress summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user._id });

        if (reports.length === 0) {
            return res.json({
                success: true,
                message: 'No study sessions yet',
                summary: {
                    totalSessions: 0,
                    totalTimeSpent: 0,
                    averageProgress: 0,
                    examReady: false,
                },
            });
        }

        // Calculate summary
        const totalSessions = reports.length;
        const totalTimeSpent = reports.reduce((sum, r) => sum + r.duration, 0);
        const averageProgress = reports.reduce((sum, r) => sum + r.overallProgress, 0) / totalSessions;
        const averageFocusScore = reports.reduce((sum, r) => sum + r.focusScore, 0) / totalSessions;

        // Determine if exam ready (simple heuristic)
        const examReady = averageProgress >= 75 && totalSessions >= 3;

        res.json({
            success: true,
            summary: {
                totalSessions,
                totalTimeSpent,
                averageProgress: averageProgress.toFixed(2),
                averageFocusScore: averageFocusScore.toFixed(2),
                examReady,
                recommendation: examReady
                    ? '🎉 You are exam-ready! Keep revising.'
                    : '📚 Keep studying! You\'re making progress.',
            },
        });
    } catch (error) {
        console.error('Get Summary Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress summary',
        });
    }
});

export default router;
