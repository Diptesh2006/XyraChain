import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export class PinataService {
    async uploadJSONToIPFS(jsonData: any): Promise<string> {
        const pinataApiKey = process.env.PINATA_API_KEY;
        const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

        if (!pinataApiKey || !pinataSecretApiKey) {
            throw new Error('Pinata credentials are not configured on the backend.');
        }

        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        try {
            const response = await axios.post(url, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey
                }
            });
            return response.data.IpfsHash;
        } catch (error: any) {
            console.error('Error uploading JSON to Pinata:', error?.response?.data || error.message);
            throw new Error(`Failed to upload report JSON to Pinata: ${error.message}`);
        }
    }

    async uploadFileToIPFS(filePath: string): Promise<string> {
        const pinataApiKey = process.env.PINATA_API_KEY;
        const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

        if (!pinataApiKey || !pinataSecretApiKey) {
            throw new Error('Pinata credentials are not configured on the backend.');
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
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey
                }
            });
            return response.data.IpfsHash;
        } catch (error: any) {
            console.error('Error uploading file to Pinata:', error?.response?.data || error.message);
            throw new Error(`Failed to upload file to Pinata: ${error.message}`);
        }
    }
}
