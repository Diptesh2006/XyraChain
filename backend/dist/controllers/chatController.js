"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || 'http://127.0.0.1:8000/chat';
// Forward message to the Python FastAPI RAG Service 
const handleMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    try {
        const response = yield axios_1.default.post(CHATBOT_SERVICE_URL, {
            message: message
        });
        // Forward the Python service's response back to our frontend
        res.json({
            response: response.data.answer, // Mapping 'answer' to 'response' for frontend consistency
            original_response: response.data
        });
    }
    catch (error) {
        console.error('Error communicating with Chatbot Service:', error.message);
        console.error(`Ensure the chatbot server is running and reachable at ${CHATBOT_SERVICE_URL}.`);
        // Fallback response if chatbot is down
        res.status(503).json({
            response: "I'm having trouble connecting to my knowledge base right now. Please try again later.",
            error: error.message
        });
    }
});
exports.handleMessage = handleMessage;
