import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from './routes/user.route.js';
import companyRoute from "./routes/company.route.js";
import jobRoute from './routes/job.route.js'; // Fixed import name
import applicationRoute from "./routes/application.route.js";
import jobRecommendationRoute from "./routes/jobRecommendation.route.js";
import resumeRoute from "./routes/resume.route.js";
import fileRoute from "./routes/file.route.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log('DOTENV_CONFIG_PATH:', path.resolve(__dirname, '../.env'));

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin:['https://jobportall-1-gylx.onrender.com','http://localhost:3000','http://localhost:8000','http://localhost:5173'],
    credentials:true
}

app.use(cors(corsOptions));

// api's
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute); // Main job routes
app.use("/api/v1/job", jobRecommendationRoute); // Job recommendation routes (same path, different methods)
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/resume", resumeRoute);

// Serve uploaded files
app.use("/api/v1/files", fileRoute);

// Serve static files in development (after API routes)
app.use(express.static(path.join(__dirname,"../frontend/dist")));

// Catch-all handler for SPA
app.get("*",(_,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
