import express from 'express';
import { protect, premiumOnly } from '../middleware/auth.js';
import { generateVoiceResponse, conductViva } from '../utils/aiService.js';

const router = express.Router();

// @route   POST /api/voice/respond
router.post('/respond', protect, premiumOnly, async (req, res) => {
    try {
        const { message, context } = req.body;
        if (!message) return res.status(400).json({ success: false, message: 'No message' });

        const language = req.user.language || 'english';
        const response = await generateVoiceResponse(message, context || '', language);

        res.json({ success: true, response, language });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Voice failed' });
    }
});

// @route   POST /api/voice/viva
router.post('/viva', protect, premiumOnly, async (req, res) => {
    try {
        const { topic, difficulty } = req.body;
        if (!topic) return res.status(400).json({ success: false, message: 'No topic' });

        const language = req.user.language || 'english';
        const question = await conductViva(topic, difficulty || 'medium', language);

        res.json({ success: true, question, topic, difficulty: difficulty || 'medium' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Viva failed' });
    }
});

export default router;
