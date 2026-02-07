import mongoose from "mongoose";
import { config } from "dotenv";
import { User } from "./models/user.model.js";
import { Job } from "./models/job.model.js";

// Load environment variables
config();

const testQuery = async () => {
    try {
        // Use MongoDB URI from .env file
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal';
        console.log('Connecting to MongoDB...');
        
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        console.log('=== TESTING BACKEND QUERY ===');
        
        const jobId = '6984fd75044c6867107d1f25';
        const jobObjectId = new mongoose.Types.ObjectId(jobId);
        
        console.log('Job ID to find:', jobId);
        console.log('Job ID as ObjectId:', jobObjectId);
        
        // Test the exact same query as backend
        const usersWithApplications = await User.find({
            'applications.job': jobObjectId
        }).populate('applications.job');
        
        console.log('Users with applications:', usersWithApplications.length);
        
        for (const user of usersWithApplications) {
            console.log(`\n--- User: ${user.fullname} ---`);
            console.log('User ID:', user._id.toString());
            console.log('Email:', user.email);
            console.log('Applications count:', user.applications?.length || 0);
            
            if (user.applications && user.applications.length > 0) {
                user.applications.forEach((app, index) => {
                    console.log(`  Application ${index + 1}:`);
                    console.log('    Job ID:', app.job?._id?.toString());
                    console.log('    Job Title:', app.job?.title || 'N/A');
                    console.log('    Status:', app.status);
                    console.log('    Applied At:', app.appliedAt);
                    
                    // Check if this matches our target job
                    const matches = app.job && app.job._id && app.job._id.toString() === jobObjectId.toString();
                    console.log('    Matches target job:', matches);
                });
            }
        }
        
        // Test alternative query
        console.log('\n=== TESTING ALTERNATIVE QUERY ===');
        const usersWithApplicationsAlt = await User.find({
            'applications': {
                $elemMatch: {
                    'job': jobObjectId
                }
            }
        }).populate('applications.job');
        
        console.log('Alternative query - Users with applications:', usersWithApplicationsAlt.length);
        
        // Test direct string comparison
        console.log('\n=== TESTING STRING COMPARISON ===');
        const usersWithStringComparison = await User.find({
            'applications.job': jobId
        }).populate('applications.job');
        
        console.log('String comparison - Users with applications:', usersWithStringComparison.length);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

testQuery();
