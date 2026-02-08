import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import userRoutes from './routes/user.route.js';
import companyRoute from "./routes/company.route.js";
import jobRoute from './routes/job.route.js';
import applicationRoute from "./routes/application.route.js";
import jobRecommendationRoute from "./routes/jobRecommendation.route.js";
import resumeRoute from "./routes/resume.route.js";
import fileRoute from "./routes/file.route.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import dotenv from 'dotenv';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables for Vercel deployment
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log('Environment loaded:', {
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
    SECRET_KEY: process.env.SECRET_KEY ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV
});

// Connect to database
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Serve uploaded files
app.use("/api/v1/files", fileRoute);

const corsOptions = {
    origin:['https://jobportall-1-gylx.onrender.com','http://localhost:3000','http://localhost:8000','http://localhost:5173','https://carrerconnect.vercel.app','https://carrerconnect-git-main-garimajunejaa.vercel.app','https://carrer-connect-flame.vercel.app'],
    credentials:true
}

app.use(cors(corsOptions));

// api's
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/job", jobRecommendationRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/resume", resumeRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!',
    });
});

// Export for Vercel
export default app;
