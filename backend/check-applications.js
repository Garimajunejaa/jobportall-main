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

const checkApplications = async () => {
    try {
        console.log('=== CHECKING APPLICATIONS ===');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            console.log(`\nUser: ${user.fullname}`);
            console.log(`Applications: ${user.applications.length}`);
            
            user.applications.forEach((app, index) => {
                console.log(`  Application ${index + 1}:`);
                console.log(`    Job ID: ${app.job}`);
                console.log(`    Status: ${app.status}`);
                console.log(`    Applied At: ${app.appliedAt}`);
                console.log(`    Applied At Type: ${typeof app.appliedAt}`);
                console.log(`    Applied At Valid: ${app.appliedAt instanceof Date}`);
                
                // If appliedAt is missing or invalid, fix it
                if (!app.appliedAt || !(app.appliedAt instanceof Date)) {
                    console.log(`    -> FIXING: Setting appliedAt to current date`);
                    app.appliedAt = new Date();
                }
            });
            
            // Save user if we made changes
            await user.save();
        }

        console.log('\n=== CHECK COMPLETE ===');

    } catch (error) {
        console.error('Error checking applications:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkApplications();
