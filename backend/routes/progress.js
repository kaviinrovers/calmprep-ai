import express from 'express';
import { protect } from '../middleware/auth.js';
import supabase from '../config/supabase.js';

const router = express.Router();

// @route   POST /api/progress/session
router.post('/session', protect, async (req, res) => {
    try {
        const { pdfId, duration, unitsCovered, overallProgress, strongAreas, weakAreas, questionsAttempted, questionsCorrect, focusScore, notes } = req.body;

        if (!pdfId || !duration) return res.status(400).json({ success: false, message: 'Missing fields' });

        // Verify PDF
        const { data: pdf, error: pdfError } = await supabase
            .from('pdfs')
            .select('id')
            .eq('id', pdfId)
            .eq('user_id', req.user.id)
            .single();

        if (pdfError || !pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        const { data: report, error } = await supabase
            .from('reports')
            .insert([{
                user_id: req.user.id,
                // pdf_id: pdfId, // Note: Schema needs pdf_id field if we want foreign key constraints
                type: 'quiz', // Defaulting type since schema requires it
                subject: 'Study Session', // Default subject
                score: overallProgress || 0,
                total_questions: questionsAttempted || 0,
                details: {
                    unitsCovered,
                    strongAreas,
                    weakAreas,
                    questionsCorrect,
                    focusScore,
                    notes,
                    duration
                }
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, message: 'Session saved', report });
    } catch (error) {
        console.error('Save Session Error:', error);
        res.status(500).json({ success: false, message: 'Save failed' });
    }
});

// @route   GET /api/progress/history
router.get('/history', protect, async (req, res) => {
    try {
        const { data: reports, error } = await supabase
            .from('reports')
            .select('*')
            .eq('user_id', req.user.id)
            .order('date', { ascending: false });

        if (error) throw error;

        res.json({ success: true, count: reports.length, reports });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Fetch failed' });
    }
});

// @route   GET /api/progress/summary
router.get('/summary', protect, async (req, res) => {
    try {
        const { data: reports, error } = await supabase
            .from('reports')
            .select('*')
            .eq('user_id', req.user.id);

        if (error) throw error;

        if (!reports || reports.length === 0) {
            return res.json({
                success: true,
                message: 'No sessions',
                summary: { totalSessions: 0, totalTimeSpent: 0, averageProgress: 0, examReady: false }
            });
        }

        const totalSessions = reports.length;
        // Extract duration from details JSON
        const totalTimeSpent = reports.reduce((sum, r) => sum + (r.details?.duration || 0), 0);
        const averageProgress = reports.reduce((sum, r) => sum + (r.score || 0), 0) / totalSessions;

        const examReady = averageProgress >= 75 && totalSessions >= 3;

        res.json({
            success: true,
            summary: {
                totalSessions,
                totalTimeSpent,
                averageProgress: averageProgress.toFixed(2),
                examReady,
                recommendation: examReady ? '🎉 Exam Ready!' : '📚 Keep studying!'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Summary failed' });
    }
});

export default router;
