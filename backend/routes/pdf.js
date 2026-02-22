import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { protect } from '../middleware/auth.js';
import supabase from '../config/supabase.js';
import { analyzePDFContent } from '../utils/aiService.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDFs allowed'), false);
    },
});

// @route POST /api/pdf/upload
router.post('/upload', protect, upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);

        const { data: pdf, error } = await supabase
            .from('pdfs')
            .insert([{
                user_id: req.user.id,
                filename: req.file.filename,
                original_name: req.file.originalname,
                text_content: pdfData.text,
                analysis: null
            }])
            .select()
            .single();

        if (error) throw error;

        // Cleanup local file
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: 'PDF uploaded',
            pdfId: pdf.id,
            originalName: pdf.original_name,
            pageCount: pdfData.numpages,
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// @route POST /api/pdf/analyze/:id
router.post('/analyze/:id', protect, async (req, res) => {
    try {
        const { data: pdf, error: fetchError } = await supabase
            .from('pdfs')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (fetchError || !pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        if (pdf.analysis) {
            return res.json({ success: true, message: 'Already analyzed', units: pdf.analysis.units });
        }

        const analysis = await analyzePDFContent(pdf.text_content);

        const { error: updateError } = await supabase
            .from('pdfs')
            .update({ analysis })
            .eq('id', pdf.id);

        if (updateError) throw updateError;

        res.json({ success: true, message: 'Analyzed successfully', units: analysis.units });
    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Analysis failed'
        });
    }
});

// @route GET /api/pdf/list
router.get('/list', protect, async (req, res) => {
    try {
        const { data: pdfs, error } = await supabase
            .from('pdfs')
            .select('id, original_name, upload_date, analysis')
            .eq('user_id', req.user.id)
            .order('upload_date', { ascending: false });

        if (error) throw error;

        res.json({ success: true, count: pdfs.length, pdfs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Fetch failed' });
    }
});

// @route GET /api/pdf/:id/units
router.get('/:id/units', protect, async (req, res) => {
    try {
        const { data: pdf, error } = await supabase
            .from('pdfs')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (error || !pdf) return res.status(404).json({ success: false, message: 'PDF not found' });

        if (!pdf.analysis) {
            return res.status(400).json({ success: false, message: 'Not analyzed yet' });
        }

        res.json({ success: true, pdfName: pdf.original_name, units: pdf.analysis.units });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Fetch units failed' });
    }
});

export default router;
