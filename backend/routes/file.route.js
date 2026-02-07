import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve uploaded files
router.get('/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        // Try multiple possible upload locations
        const possiblePaths = [
            path.join(process.cwd(), '..', 'uploads', filename),  // Correct: d:\jobportall-main\uploads
            path.join(process.cwd(), 'uploads', filename),  // Fallback
            path.join(__dirname, '..', 'uploads', filename)  // Fallback
        ];
        
        let filePath = null;
        for (const possiblePath of possiblePaths) {
            console.log('Checking path:', possiblePath);
            if (fs.existsSync(possiblePath)) {
                filePath = possiblePath;
                break;
            }
        }
        
        if (!filePath) {
            console.log('File not found in any location:', filename);
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }
        
        console.log('Serving file:', filename);
        console.log('File path found:', filePath);
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(500).json({
            success: false,
            message: 'Error serving file'
        });
    }
});

export default router;
