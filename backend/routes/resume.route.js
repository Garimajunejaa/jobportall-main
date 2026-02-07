import express from "express";
import { User } from "../models/user.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Route to download user's resume (local file serving)
router.route("/download").get(isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId || req.id;
        console.log('=== RESUME DOWNLOAD START ===');
        console.log('User ID:', userId);
        console.log('Request userId:', req.userId);
        console.log('Request id:', req.id);
        
        // Only allow users to download their own resume
        if (req.userId !== userId) {
            console.log('Access denied - userId mismatch');
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const user = await User.findById(userId);
        console.log('User found:', !!user);
        console.log('User profile:', !!user?.profile);
        console.log('Resume field:', user?.profile?.resume);
        
        if (!user || !user.profile?.resume) {
            console.log('Resume not found in user profile');
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        const resumeUrl = user.profile.resume;
        console.log('Resume URL:', resumeUrl);
        
        // If it's a local file (stored as /api/v1/files/{filename}), convert to actual file path
        if (resumeUrl.startsWith('/api/v1/files/')) {
            const filename = resumeUrl.split('/').pop();
            const filePath = path.join(process.cwd(), '..', 'uploads', filename);
            console.log('Local file path:', filePath);
            console.log('File exists:', fs.existsSync(filePath));
            
            if (fs.existsSync(filePath)) {
                console.log('Serving local file');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${user.profile.resumeOriginalName || 'resume.pdf'}"`);
                res.sendFile(filePath);
                return;
            } else {
                console.log('Local file not found at path:', filePath);
            }
        }
        
        // If it's a Cloudinary URL, redirect to it
        console.log('Redirecting to Cloudinary URL:', resumeUrl);
        return res.redirect(301, resumeUrl);

    } catch (error) {
        console.error("Download resume error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Route to view user's resume (local file serving)
router.route("/view").get(isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId || req.id;
        
        // Only allow users to view their own resume
        if (req.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const user = await User.findById(userId);
        
        if (!user || !user.profile?.resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        const resumeUrl = user.profile.resume;
        console.log('Resume URL:', resumeUrl);
        
        // If it's a local file (stored as /api/v1/files/{filename}), convert to actual file path
        if (resumeUrl.startsWith('/api/v1/files/')) {
            const filename = resumeUrl.split('/').pop();
            const filePath = path.join(process.cwd(), '..', 'uploads', filename);
            console.log('Local file path:', filePath);
            console.log('File exists:', fs.existsSync(filePath));
            
            if (fs.existsSync(filePath)) {
                console.log('Serving local file');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename="' + (user.profile.resumeOriginalName || 'resume.pdf') + '"');
                res.sendFile(filePath);
                return;
            } else {
                console.log('Local file not found at path:', filePath);
            }
        }
        
        // If it's a Cloudinary URL, redirect to it
        console.log('Redirecting to Cloudinary URL:', resumeUrl);
        return res.redirect(301, resumeUrl);

    } catch (error) {
        console.error("View resume error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Route to get user's resume info
router.route("/resume/:userId").get(isAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Only allow users to access their own resume
        if (req.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const user = await User.findById(userId);
        
        if (!user || !user.profile?.resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        // Return the resume URL
        return res.status(200).json({
            success: true,
            resumeUrl: user.profile.resume,
            resumeOriginalName: user.profile.resumeOriginalName,
            isLocal: user.profile.resume.startsWith('/api/v1/files/')
        });

    } catch (error) {
        console.error("Error fetching resume:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching resume"
        });
    }
});

export default router;
