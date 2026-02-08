import { spawn } from 'child_process';
import path from 'path';

export class PythonService {
    private pythonPath: string;
    private aiModulePath: string;

    constructor() {
        this.pythonPath = 'python'; 
        this.aiModulePath = path.resolve(__dirname, '../../../ai-module'); 
    }

    async runPrediction(imagePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(this.aiModulePath, 'prediction.py');
            const process = spawn(this.pythonPath, [scriptPath, '--image', imagePath]);

            let output = '';
            let errorOutput = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    return reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
                }
                try {
                    const result = JSON.parse(output);
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${output}`));
                }
            });
        });
    }

    async generateGradCam(imagePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(this.aiModulePath, 'gradcam.py');
            // We'll let gradcam handle output file naming unless specified
            const process = spawn(this.pythonPath, [scriptPath, '--image', imagePath]);

            let output = '';
            let errorOutput = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    return reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
                }
                try {
                    const result = JSON.parse(output);
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${output}`));
                }
            });
        });
    }
}
