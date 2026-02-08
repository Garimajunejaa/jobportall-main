import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";
import jobRecommendationRouter from "./routes/jobRecommendation.route.js";
import companyRouter from "./routes/company.route.js";

const app = express();

import dotenv from 'dotenv';
dotenv.config();

// Connect to database
connectDB();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);  // Changed from /jobs to /job to match frontend
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/company", companyRouter);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!',
    });
});

export default app;
