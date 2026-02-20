import express from 'express';
import { protect } from '../middleware/auth.js';
import supabase from '../config/supabase.js';
import { generateAnswer } from '../utils/aiService.js';

const router = express.Router();

// @route   POST /api/questions/answer
router.post('/answer', protect, async (req, res) => {
    try {
        const { question, marks, pdfId, unitNumber } = req.body;

        if (!question || !marks || !pdfId) {
            return res.status(400).json({ success: false, message: 'Missing fields' });
        }

        const { data: pdf, error } = await supabase
            .from('pdfs')
            .select('*')
            .eq('id', pdfId)
            .eq('user_id', req.user.id)
            .single();

        if (error || !pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        let context = '';
        if (unitNumber && pdf.analysis?.units) {
            const unit = pdf.analysis.units.find(u => u.unitNumber === unitNumber);
            if (unit) context = unit.importantTopics.map(t => t.text).join('\n');
        }

        if (!context) context = pdf.text_content.substring(0, 3000);

        const language = req.user.language || 'english';
        const answerData = await generateAnswer(question, marks, context, language);

        res.json({ success: true, ...answerData });
    } catch (error) {
        console.error('Answer Error:', error);
        res.status(500).json({ success: false, message: 'Answer failed' });
    }
});

// @route   POST /api/questions/explain
router.post('/explain', protect, async (req, res) => {
    try {
        const { answer, language } = req.body;
        if (!answer) return res.status(400).json({ success: false, message: 'No answer provided' });

        const targetLanguage = language || req.user.language || 'english';
        const { generateAnswer: genAnswer } = await import('../utils/aiService.js');

        const explanation = await genAnswer(
            `Explain this clearly: ${answer}`,
            5,
            answer,
            targetLanguage
        );

        res.json({ success: true, explanation: explanation.answer, language: targetLanguage });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Explain failed' });
    }
});

export default router;
