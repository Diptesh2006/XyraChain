import express from 'express';
import { uploadImage, generateReport } from '../controllers/analysisController';
import { upload } from '../middleware/fileUpload';

const router = express.Router();

// POST /api/analysis/upload
router.post('/upload', upload.single('xray'), uploadImage);

// POST /api/analysis/generate-report
router.post('/generate-report', generateReport);

export default router;
