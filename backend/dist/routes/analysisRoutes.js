"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analysisController_1 = require("../controllers/analysisController");
const fileUpload_1 = require("../middleware/fileUpload");
const router = express_1.default.Router();
// POST /api/analysis/upload
router.post('/upload', fileUpload_1.upload.single('xray'), analysisController_1.uploadImage);
// POST /api/analysis/generate-report
router.post('/generate-report', analysisController_1.generateReport);
exports.default = router;
