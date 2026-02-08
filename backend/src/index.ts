import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import analysisRoutes from './routes/analysisRoutes';
import chatRoutes from './routes/chatRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
