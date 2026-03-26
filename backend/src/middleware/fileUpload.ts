import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    if (file.mimetype && allowedMimeTypes.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PNG, JPEG, and WebP image uploads are supported.'));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
