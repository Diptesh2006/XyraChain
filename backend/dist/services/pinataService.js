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
exports.PinataService = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class PinataService {
    uploadJSONToIPFS(jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pinataApiKey = process.env.PINATA_API_KEY;
            const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
            if (!pinataApiKey || !pinataSecretApiKey) {
                throw new Error('Pinata credentials are not configured on the backend.');
            }
            const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
            try {
                const response = yield axios_1.default.post(url, jsonData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'pinata_api_key': pinataApiKey,
                        'pinata_secret_api_key': pinataSecretApiKey
                    }
                });
                return response.data.IpfsHash;
            }
            catch (error) {
                console.error('Error uploading JSON to Pinata:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error(`Failed to upload report JSON to Pinata: ${error.message}`);
            }
        });
    }
    uploadFileToIPFS(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pinataApiKey = process.env.PINATA_API_KEY;
            const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
            if (!pinataApiKey || !pinataSecretApiKey) {
                throw new Error('Pinata credentials are not configured on the backend.');
            }
            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            let data = new form_data_1.default();
            data.append('file', fs_1.default.createReadStream(filePath));
            // Optional metadata
            const metadata = JSON.stringify({
                name: path_1.default.basename(filePath),
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
                const response = yield axios_1.default.post(url, data, {
                    maxBodyLength: Infinity, // Important for large files
                    headers: Object.assign(Object.assign({}, data.getHeaders()), { 'pinata_api_key': pinataApiKey, 'pinata_secret_api_key': pinataSecretApiKey })
                });
                return response.data.IpfsHash;
            }
            catch (error) {
                console.error('Error uploading file to Pinata:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error(`Failed to upload file to Pinata: ${error.message}`);
            }
        });
    }
}
exports.PinataService = PinataService;
