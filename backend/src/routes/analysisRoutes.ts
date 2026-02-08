import express from 'express';
import multer from 'multer';
import { uploadImage, generateReport } from '../controllers/analysisController';
import path from 'path';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Assuming 'uploads/' exists at root
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// POST /api/analysis/upload
router.post('/upload', upload.single('xray'), uploadImage);

// POST /api/analysis/generate-report
router.post('/generate-report', generateReport);

export default router;
