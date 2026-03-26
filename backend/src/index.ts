import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import analysisRoutes from './routes/analysisRoutes';
import chatRoutes from './routes/chatRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGIN;

// Middleware
app.use(cors(corsOrigin ? { origin: corsOrigin.split(',').map((origin) => origin.trim()) } : undefined));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
// Adjust path if needed.
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('XyraChain Backend is running');
});

app.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof multer.MulterError) {
        return res.status(400).json({ status: 'error', message: error.message });
    }

    if (error instanceof Error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
