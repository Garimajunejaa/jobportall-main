import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/user.model.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the correct path
dotenv.config({ path: path.resolve(__dirname, './.env') });

const testApplications = async () => {
    try {
        console.log('=== TESTING APPLICATIONS API ===');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            console.log(`\nUser: ${user.fullname}`);
            console.log(`User ID: ${user._id}`);
            console.log(`Applications: ${user.applications.length}`);
            
            user.applications.forEach((app, index) => {
                console.log(`  Application ${index + 1}:`);
                console.log(`    _id: ${app._id}`);
                console.log(`    job: ${app.job}`);
                console.log(`    job type: ${typeof app.job}`);
                console.log(`    status: ${app.status}`);
                console.log(`    appliedAt: ${app.appliedAt}`);
                
                // Test if job ID is a valid ObjectId
                if (app.job) {
                    console.log(`    job is ObjectId: ${app.job instanceof mongoose.Types.ObjectId}`);
                    console.log(`    job toString(): ${app.job.toString()}`);
                }
            });
        }

        console.log('\n=== TEST COMPLETE ===');

    } catch (error) {
        console.error('Error testing applications:', error);
    } finally {
        await mongoose.disconnect();
    }
};

testApplications();
