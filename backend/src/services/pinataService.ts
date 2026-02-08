import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

export class PinataService {
    async uploadJSONToIPFS(jsonData: any): Promise<string> {
        if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
            console.warn("⚠️ Pinata API Keys missing in backend/.env. Returning Mock CID.");
            return "QmMockCIDForDevelopment" + Date.now();
        }

        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        try {
            const response = await axios.post(url, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY
                }
            });
            return response.data.IpfsHash;
        } catch (error: any) {
            console.error('Error uploading JSON to Pinata:', error?.response?.data || error.message);
            // Fallback for development if Pinata fails
            return "QmFallbackCID" + Date.now();
        }
    }

    async uploadFileToIPFS(filePath: string): Promise<string> {
        if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
            console.warn("⚠️ Pinata API Keys missing. Returning Mock CID.");
            return "QmMockFileCID" + Date.now();
        }

        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let data = new FormData();
        data.append('file', fs.createReadStream(filePath));

        // Optional metadata
        const metadata = JSON.stringify({
            name: path.basename(filePath),
            keyvalues: {
                exampleKey: 'exampleValue'
            }
        });
        data.append('pinataMetadata', metadata);

        // Optional options
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        });
        data.append('pinataOptions', pinataOptions);

        try {
            const response = await axios.post(url, data, {
                maxBodyLength: Infinity, // Important for large files
                headers: {
                    ...data.getHeaders(), // Important for form-data
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY
                }
            });
            return response.data.IpfsHash;
        } catch (error: any) {
            console.error('Error uploading file to Pinata:', error?.response?.data || error.message);
            throw new Error(`Failed to upload file to Pinata: ${error.message}`);
        }
    }
}
