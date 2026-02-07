import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test MongoDB connection
app.get('/test-db', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        res.json({ success: true, message: 'MongoDB connected' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test basic API
app.get('/test-api', (req, res) => {
    res.json({ success: true, message: 'API working' });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
