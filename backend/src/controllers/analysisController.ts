
import { Request, Response } from 'express';
import { PythonService } from '../services/pythonService';
import { PinataService } from '../services/pinataService';
import fs from 'fs';

const pythonService = new PythonService();
const pinataService = new PinataService();

export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
        }

        const filePath = req.file.path;

        // Run Prediction
        const prediction = await pythonService.runPrediction(filePath);

        // Run Grad-CAM
        const gradcam = await pythonService.generateGradCam(filePath);

        // Construct response
        // Note: Grad-CAM output path might be relative or absolute.
        // We need to return a URL or path that the frontend can access.
        // For now, we return the path from the script output.
        // The backend `index.ts` serves `uploads/` statically.

        res.json({
            status: 'success',
            diagnosis: prediction.prediction,
            confidence: prediction.probability,
            heatmap: gradcam.output_path, // Path to the generated heatmap image
            originalImage: filePath
        });

    } catch (error: any) {
        console.error('Analysis error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const generateReport = async (req: Request, res: Response) => {
    try {
        const { analysisResult, chatLogs, userAddress } = req.body;

        if (!analysisResult || !chatLogs) {
            return res.status(400).json({ status: 'error', message: 'Missing report data.' });
        }

        // Create the report object
        const report = {
            timestamp: new Date().toISOString(),
            patientAddress: userAddress || 'Anonymous',
            analysis: analysisResult,
            consultation: chatLogs,
            metadata: {
                version: '1.0',
                generator: 'XyraChain AI'
            }
        };

        // Pin JSON to IPFS
        const cid = await pinataService.uploadJSONToIPFS(report);

        res.json({
            status: 'success',
            cid: cid,
            ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cid}`
        });

    } catch (error: any) {
        console.error('Report generation error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
