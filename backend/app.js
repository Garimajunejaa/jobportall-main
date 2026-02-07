import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";
import jobRecommendationRouter from "./routes/jobRecommendation.route.js";
import companyRouter from "./routes/company.route.js";

const app = express();

import dotenv from 'dotenv';
dotenv.config();

// CORS is handled in index.js

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobs", jobRouter);  // Add job routes
app.use("/api/v1/application", applicationRouter);  // Add application routes
app.use("/api/v1/job", jobRecommendationRouter);  // Add job recommendation routes
app.use("/api/v1/company", companyRouter);  // Add company routes


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!',
    });
});
