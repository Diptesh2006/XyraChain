import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

interface PythonInferenceResult {
    status: string;
    prediction?: string;
    probability?: number;
    output_path?: string;
    message?: string;
}

export class PythonService {
    private pythonPath: string;
    private aiModulePath: string;

    constructor() {
        this.pythonPath = process.env.PYTHON_BIN || 'python';
        this.aiModulePath = process.env.AI_MODULE_PATH
            ? path.resolve(process.env.AI_MODULE_PATH)
            : path.resolve(__dirname, '../../../ai-module');
    }

    async runPrediction(imagePath: string): Promise<PythonInferenceResult> {
        return this.runScript('prediction.py', imagePath);
    }

    async generateGradCam(imagePath: string): Promise<PythonInferenceResult> {
        return this.runScript('gradcam.py', imagePath);
    }

    private async runScript(scriptName: string, imagePath: string): Promise<PythonInferenceResult> {
        const scriptPath = path.join(this.aiModulePath, scriptName);

        if (!fs.existsSync(scriptPath)) {
            throw new Error(`Required AI script not found: ${scriptPath}`);
        }

        return new Promise((resolve, reject) => {
            const process = spawn(this.pythonPath, [scriptPath, '--image', imagePath], {
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
                    const result = JSON.parse(output) as PythonInferenceResult;
                    if (result.status !== 'success') {
                        return reject(new Error(result.message || `${scriptName} failed without a detailed error.`));
                    }
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${output}`));
                }
            });
        });
    }
}
