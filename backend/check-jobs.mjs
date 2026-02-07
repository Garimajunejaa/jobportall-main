import mongoose from "mongoose";
import { config } from "dotenv";
import { Job } from "./models/job.model.js";

// Load environment variables
config();

const checkJobs = async () => {
    try {
        // Use MongoDB URI from .env file
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal';
        console.log('Connecting to MongoDB with URI:', mongoUri.replace(/\/\/.*@/, '//***:***@'));
        
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        console.log('=== CHECKING JOBS IN DATABASE ===');
        
        const jobs = await Job.find({});
        console.log(`Total jobs found: ${jobs.length}`);
        
        jobs.forEach((job, index) => {
            console.log(`\n--- Job ${index + 1} ---`);
            console.log('Job ID:', job._id.toString());
            console.log('Job Title:', job.title);
            console.log('Job Company:', job.company?.name || 'N/A');
            console.log('Job Location:', job.location);
            console.log('Created By:', job.createdBy?.toString());
        });
        
        // Check specific job IDs
        console.log('\n=== CHECKING SPECIFIC JOB IDs ===');
        const jobIds = [
            '6984fd75044c6867107d1f25',
            '698506113ff8669a4ec65f25'
        ];
        
        for (const jobId of jobIds) {
            try {
                const job = await Job.findById(jobId);
                if (job) {
                    console.log(`✅ Job ${jobId} found: ${job.title}`);
                } else {
                    console.log(`❌ Job ${jobId} NOT found`);
                }
            } catch (error) {
                console.log(`❌ Error checking job ${jobId}:`, error.message);
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkJobs();
