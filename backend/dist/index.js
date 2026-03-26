"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const analysisRoutes_1 = __importDefault(require("./routes/analysisRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGIN;
// Middleware
app.use((0, cors_1.default)(corsOrigin ? { origin: corsOrigin.split(',').map((origin) => origin.trim()) } : undefined));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files (uploads)
// Adjust path if needed.
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
app.use('/uploads', express_1.default.static(uploadsDir));
// Routes
app.use('/api/analysis', analysisRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
// Health Check
app.get('/', (req, res) => {
    res.send('XyraChain Backend is running');
});
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    if (error instanceof multer_1.default.MulterError) {
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
