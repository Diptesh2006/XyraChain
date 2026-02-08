import express from 'express';
import { handleMessage } from '../controllers/chatController';

const router = express.Router();

// POST /api/chat/message
router.post('/message', handleMessage);

export default router;
