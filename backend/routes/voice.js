import express from 'express';
import { protect, premiumOnly } from '../middleware/auth.js';
import { generateVoiceResponse, conductViva } from '../utils/aiService.js';

const router = express.Router();

// @route   POST /api/voice/respond
// @desc    Get AI voice response (Premium)
// @access  Private + Premium
router.post('/respond', protect, premiumOnly, async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a message',
            });
        }

        const language = req.user.language || 'english';
        const response = await generateVoiceResponse(message, context || '', language);

        res.json({
            success: true,
            response,
            language,
        });
    } catch (error) {
        console.error('Voice Response Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate voice response',
        });
    }
});

// @route   POST /api/voice/viva
// @desc    Conduct oral viva session (Premium)
// @access  Private + Premium
router.post('/viva', protect, premiumOnly, async (req, res) => {
    try {
        const { topic, difficulty } = req.body;

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a topic for viva',
            });
        }

        const language = req.user.language || 'english';
        const question = await conductViva(topic, difficulty || 'medium', language);

        res.json({
            success: true,
            question,
            topic,
            difficulty: difficulty || 'medium',
        });
    } catch (error) {
        console.error('Viva Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to conduct viva',
        });
    }
});

export default router;
