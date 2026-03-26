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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = exports.uploadImage = void 0;
const pythonService_1 = require("../services/pythonService");
const pinataService_1 = require("../services/pinataService");
const pythonService = new pythonService_1.PythonService();
const pinataService = new pinataService_1.PinataService();
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
        }
        const filePath = req.file.path;
        // Run Prediction
        const prediction = yield pythonService.runPrediction(filePath);
        // Run Grad-CAM
        const gradcam = yield pythonService.generateGradCam(filePath);
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
    }
    catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.uploadImage = uploadImage;
const generateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const cid = yield pinataService.uploadJSONToIPFS(report);
        res.json({
            status: 'success',
            cid: cid,
            ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cid}`
        });
    }
    catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.generateReport = generateReport;
