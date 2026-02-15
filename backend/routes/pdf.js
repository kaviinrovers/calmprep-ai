import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { protect } from '../middleware/auth.js';
import PDF from '../models/PDF.js';
import { analyzePDFContent } from '../utils/aiService.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// @route   POST /api/pdf/upload
// @desc    Upload and extract PDF text
// @access  Private
router.post('/upload', protect, upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF file',
            });
        }

        // Read and parse PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);

        // Save PDF info to database
        const pdf = await PDF.create({
            user: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            fileSize: req.file.size,
            extractedText: pdfData.text,
            analyzed: false,
        });

        res.status(201).json({
            success: true,
            message: 'PDF uploaded successfully. Now analyzing...',
            pdfId: pdf._id,
            originalName: pdf.originalName,
            pageCount: pdfData.numpages,
        });
    } catch (error) {
        console.error('PDF Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload and parse PDF',
        });
    }
});

// @route   POST /api/pdf/analyze/:id
// @desc    Analyze PDF content with AI
// @access  Private
router.post('/analyze/:id', protect, async (req, res) => {
    try {
        const pdf = await PDF.findOne({ _id: req.params.id, user: req.user._id });

        if (!pdf) {
            return res.status(404).json({
                success: false,
                message: 'PDF not found',
            });
        }

        if (pdf.analyzed) {
            return res.json({
                success: true,
                message: 'PDF already analyzed',
                units: pdf.units,
            });
        }

        // Analyze with AI
        const analysis = await analyzePDFContent(pdf.extractedText);

        // Update PDF with analysis
        pdf.units = analysis.units.map(unit => ({
            unitNumber: unit.unitNumber,
            unitName: unit.unitName,
            content: '', // We don't store full content per unit
            importantTopics: unit.importantTopics.map(topic => ({
                text: topic.text,
                importance: topic.importance,
                startIndex: 0,
                endIndex: 0,
            })),
            predictedQuestions: unit.predictedQuestions.map(q => ({
                question: q.question,
                marks: q.marks,
                guidance: {
                    howToStart: q.guidance.howToStart,
                    keyPoints: q.guidance.keyPoints,
                    expectedLength: q.guidance.expectedLength,
                    keywords: q.guidance.keywords,
                },
            })),
            studyGuidance: {
                twoMark: {
                    expectedLines: unit.studyGuidance.twoMark.expectedLines,
                    keywords: unit.studyGuidance.twoMark.keywords,
                },
                fiveMark: {
                    expectedPoints: unit.studyGuidance.fiveMark.expectedPoints,
                    diagramNeeded: unit.studyGuidance.fiveMark.diagramNeeded,
                    explanation: unit.studyGuidance.fiveMark.explanation,
                },
                tenMark: {
                    structure: unit.studyGuidance.tenMark.structure,
                    minimumLength: unit.studyGuidance.tenMark.minimumLength,
                    mustInclude: unit.studyGuidance.tenMark.mustInclude,
                },
            },
        }));

        pdf.analyzed = true;
        await pdf.save();

        res.json({
            success: true,
            message: 'PDF analyzed successfully',
            units: pdf.units,
        });
    } catch (error) {
        console.error('PDF Analysis Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze PDF',
            error: error.message,
        });
    }
});

// @route   GET /api/pdf/list
// @desc    Get all user PDFs
// @access  Private
router.get('/list', protect, async (req, res) => {
    try {
        const pdfs = await PDF.find({ user: req.user._id })
            .select('-extractedText')
            .sort({ uploadedAt: -1 });

        res.json({
            success: true,
            count: pdfs.length,
            pdfs,
        });
    } catch (error) {
        console.error('Get PDFs Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch PDFs',
        });
    }
});

// @route   GET /api/pdf/:id/units
// @desc    Get unit-wise analysis
// @access  Private
router.get('/:id/units', protect, async (req, res) => {
    try {
        const pdf = await PDF.findOne({ _id: req.params.id, user: req.user._id });

        if (!pdf) {
            return res.status(404).json({
                success: false,
                message: 'PDF not found',
            });
        }

        if (!pdf.analyzed) {
            return res.status(400).json({
                success: false,
                message: 'PDF not yet analyzed. Please analyze first.',
            });
        }

        res.json({
            success: true,
            pdfName: pdf.originalName,
            units: pdf.units,
        });
    } catch (error) {
        console.error('Get Units Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch units',
        });
    }
});

export default router;
