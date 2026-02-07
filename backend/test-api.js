import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Job } from './models/job.model.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test-jobs', async (req, res) => {
    try {
        const jobs = await Job.find().populate('company', 'name logo location').limit(5);
        res.json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Test the main endpoint
app.get('/test-main', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/job/all');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = 8001;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
