import { Request, Response } from 'express';
import axios from 'axios';

// Forward message to the Python FastAPI RAG Service 
export const handleMessage = async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Call the internal Python Chatbot Service running on port 8000
        const response = await axios.post('http://127.0.0.1:8000/chat', {
            message: message
        });

        // Forward the Python service's response back to our frontend
        res.json({
            response: response.data.answer, // Mapping 'answer' to 'response' for frontend consistency
            original_response: response.data
        });

    } catch (error: any) {
        console.error('Error communicating with Chatbot Service:', error.message);
        console.error('Ensure the chatbot server is running on port 8000.');

        // Fallback response if chatbot is down
        res.status(503).json({
            response: "I'm having trouble connecting to my knowledge base right now. Please try again later.",
            error: error.message
        });
    }
};
