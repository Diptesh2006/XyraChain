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
exports.PythonService = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class PythonService {
    constructor() {
        this.pythonPath = process.env.PYTHON_BIN || 'python';
        this.aiModulePath = process.env.AI_MODULE_PATH
            ? path_1.default.resolve(process.env.AI_MODULE_PATH)
            : path_1.default.resolve(__dirname, '../../../ai-module');
    }
    runPrediction(imagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runScript('prediction.py', imagePath);
        });
    }
    generateGradCam(imagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runScript('gradcam.py', imagePath);
        });
    }
    runScript(scriptName, imagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const scriptPath = path_1.default.join(this.aiModulePath, scriptName);
            if (!fs_1.default.existsSync(scriptPath)) {
                throw new Error(`Required AI script not found: ${scriptPath}`);
            }
            return new Promise((resolve, reject) => {
                const process = (0, child_process_1.spawn)(this.pythonPath, [scriptPath, '--image', imagePath], {
                    cwd: this.aiModulePath,
                });
                let output = '';
                let errorOutput = '';
                process.stdout.on('data', (data) => {
                    output += data.toString();
                });
                process.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });
                process.on('error', (error) => {
                    reject(new Error(`Failed to start Python process with '${this.pythonPath}': ${error.message}`));
                });
                process.on('close', (code) => {
                    if (code !== 0) {
                        return reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
                    }
                    try {
                        const result = JSON.parse(output);
                        if (result.status !== 'success') {
                            return reject(new Error(result.message || `${scriptName} failed without a detailed error.`));
                        }
                        resolve(result);
                    }
                    catch (e) {
                        reject(new Error(`Failed to parse Python output: ${output}`));
                    }
                });
            });
        });
    }
}
exports.PythonService = PythonService;
