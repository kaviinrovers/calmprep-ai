import express from 'express';
import { protect } from '../middleware/auth.js';
import PDF from '../models/PDF.js';
import { generateAnswer } from '../utils/aiService.js';

const router = express.Router();

// @route   POST /api/questions/answer
// @desc    Generate AI answer for a question
// @access  Private
router.post('/answer', protect, async (req, res) => {
    try {
        const { question, marks, pdfId, unitNumber } = req.body;

        // Validation
        if (!question || !marks || !pdfId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide question, marks, and pdfId',
            });
        }

        if (![2, 5, 10].includes(marks)) {
            return res.status(400).json({
                success: false,
                message: 'Marks must be 2, 5, or 10',
            });
        }

        // Get PDF content for context
        const pdf = await PDF.findOne({ _id: pdfId, user: req.user._id });
        if (!pdf) {
            return res.status(404).json({
                success: false,
                message: 'PDF not found',
            });
        }

        // Get relevant context (either specific unit or full PDF)
        let context = '';
        if (unitNumber && pdf.units && pdf.units.length > 0) {
            const unit = pdf.units.find(u => u.unitNumber === unitNumber);
            if (unit) {
                // Use unit-specific topics as context
                context = unit.importantTopics.map(t => t.text).join('\n');
            }
        }

        // Fallback to full PDF text (limited to first 3000 chars for API limits)
        if (!context) {
            context = pdf.extractedText.substring(0, 3000);
        }

        // Generate answer using AI
        const language = req.user.language || 'english';
        const answerData = await generateAnswer(question, marks, context, language);

        res.json({
            success: true,
            ...answerData,
        });
    } catch (error) {
        console.error('Answer Generation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate answer',
            error: error.message,
        });
    }
});

// @route   POST /api/questions/explain
// @desc    Explain an answer in selected language
// @access  Private
router.post('/explain', protect, async (req, res) => {
    try {
        const { answer, language } = req.body;

        if (!answer) {
            return res.status(400).json({
                success: false,
                message: 'Please provide the answer to explain',
            });
        }

        const targetLanguage = language || req.user.language || 'english';

        // Use AI to explain/translate
        const { generateAnswer } = await import('../utils/aiService.js');
        const explanation = await generateAnswer(
            `Explain this answer clearly and simply: ${answer}`,
            5,
            answer,
            targetLanguage
        );

        res.json({
            success: true,
            explanation: explanation.answer,
            language: targetLanguage,
        });
    } catch (error) {
        console.error('Explain Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to explain answer',
        });
    }
});

export default router;
