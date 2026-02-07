import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the correct path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Cloudinary config:', {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET ? 'Set' : 'Not set'
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const generateSignedUrl = (publicId, options = {}) => {
    return cloudinary.url(publicId, {
        type: 'upload',
        sign_url: true,
        resource_type: 'raw',
        ...options
    });
};

export default cloudinary;
