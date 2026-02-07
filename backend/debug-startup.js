import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test basic server
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!', port: 8000 });
});

// Test MongoDB connection
app.get('/test-mongo', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        res.json({ success: true, message: 'MongoDB connected successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test API endpoint
app.get('/api/v1/job/test', async (req, res) => {
    try {
        const Job = require('./models/job.model.js').Job;
        const jobs = await Job.find().limit(3);
        res.json({ success: true, count: jobs.length, jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Debug server running on port ${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGO_URI ? 'Set' : 'Not set'}`);
});
