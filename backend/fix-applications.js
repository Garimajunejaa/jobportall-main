import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/user.model.js';
import { Job } from './models/job.model.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the correct path
dotenv.config({ path: path.resolve(__dirname, './.env') });

console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('DOTENV_PATH:', path.resolve(__dirname, './.env'));

const fixApplications = async () => {
    try {
        console.log('=== FIXING APPLICATIONS ===');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        // Get all current jobs
        const jobs = await Job.find({});
        console.log(`Found ${jobs.length} jobs in database`);

        // Create a set of valid job IDs
        const validJobIds = new Set(jobs.map(job => job._id.toString()));
        console.log('Valid job IDs:', validJobIds.size);

        let totalApplicationsRemoved = 0;
        let totalUsersUpdated = 0;

        // Fix each user's applications
        for (const user of users) {
            console.log(`\nProcessing user: ${user.fullname}`);
            console.log(`Current applications: ${user.applications.length}`);
            
            // Filter out applications that reference invalid jobs
            const validApplications = user.applications.filter(app => {
                const jobId = app.job?.toString();
                const isValid = validJobIds.has(jobId);
                
                if (!isValid) {
                    console.log(`  - Removing invalid application for job: ${jobId}`);
                    totalApplicationsRemoved++;
                }
                
                return isValid;
            });

            // Update user if applications changed
            if (validApplications.length !== user.applications.length) {
                user.applications = validApplications;
                await user.save();
                totalUsersUpdated++;
                console.log(`  - Updated user applications: ${validApplications.length} remaining`);
            } else {
                console.log(`  - No changes needed for this user`);
            }
        }

        console.log('\n=== FIXING COMPLETE ===');
        console.log(`Total applications removed: ${totalApplicationsRemoved}`);
        console.log(`Total users updated: ${totalUsersUpdated}`);
        console.log('Applications are now clean and valid!');

    } catch (error) {
        console.error('Error fixing applications:', error);
    } finally {
        await mongoose.disconnect();
    }
};

fixApplications();
