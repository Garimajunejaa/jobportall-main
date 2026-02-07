import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/api/v1/job/all', (req, res) => {
    // Return mock data for testing
    const mockJobs = [
        {
            _id: '1',
            title: 'Senior Frontend Developer',
            description: 'Test job 1',
            requirements: ['React', 'TypeScript'],
            salary: 120000,
            location: 'New York, NY',
            jobType: 'full-time',
            experienceLevel: '5',
            position: 'Senior Developer',
            category: 'technology',
            company: {
                _id: 'comp1',
                name: 'TechCorp Solutions',
                logo: 'https://logo.clearbit.com/techcorp.com',
                location: 'New York, NY'
            },
            createdAt: new Date()
        },
        {
            _id: '2',
            title: 'Backend Engineer',
            description: 'Test job 2',
            requirements: ['Node.js', 'MongoDB'],
            salary: 110000,
            location: 'San Francisco, CA',
            jobType: 'full-time',
            experienceLevel: '3',
            position: 'Backend Engineer',
            category: 'technology',
            company: {
                _id: 'comp2',
                name: 'DataDriven Analytics',
                logo: 'https://logo.clearbit.com/datadriven.com',
                location: 'San Francisco, CA'
            },
            createdAt: new Date()
        }
    ];

    res.json({
        success: true,
        count: mockJobs.length,
        jobs: mockJobs
    });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Minimal server running on port ${PORT}`);
    console.log('Test endpoint: http://localhost:8000/api/v1/job/all');
});
