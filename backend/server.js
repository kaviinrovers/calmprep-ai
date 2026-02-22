import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.js';
import pdfRoutes from './routes/pdf.js';
import questionRoutes from './routes/questions.js';
import voiceRoutes from './routes/voice.js';
import progressRoutes from './routes/progress.js';
import paymentRoutes from './routes/payment.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://calmprep-ai.vercel.app',
    'https://calmprep-ai-kaviinrovers.vercel.app',
    'https://calmprep-ai-7t6b.vercel.app',
    // Add your production domain here
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Allow all local development and all vercel.app domains
        const isVercel = origin.endsWith('.vercel.app');
        const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');

        if (allowedOrigins.indexOf(origin) !== -1 || isVercel || isLocal) {
            callback(null, true);
        } else {
            console.error('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payment', paymentRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: '🎓 Welcome to CalmPrep AI - Your Exam Preparation Companion',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            pdf: '/api/pdf',
            questions: '/api/questions',
            voice: '/api/voice (Premium)',
            progress: '/api/progress',
            payment: '/api/payment',
        },
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n✨ CalmPrep AI Backend Running`);
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🗄️  Database: Supabase (PostgreSQL)`);
    console.log(`🤖 AI: DeepSeek`);
    console.log(`💳 Payment: Razorpay\n`);
});
