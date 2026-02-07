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

console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');

const fixApplicationDates = async () => {
    try {
        console.log('=== FIXING APPLICATION DATES ===');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        let totalApplicationsUpdated = 0;
        let totalUsersUpdated = 0;

        // Fix each user's applications
        for (const user of users) {
            console.log(`\nProcessing user: ${user.fullname}`);
            console.log(`Current applications: ${user.applications.length}`);
            
            let hasChanges = false;
            
            // Update applications that don't have proper appliedAt dates
            user.applications.forEach((app, index) => {
                if (!app.appliedAt || app.appliedAt === 'Invalid Date') {
                    console.log(`  - Fixing application ${index + 1}`);
                    app.appliedAt = new Date().toISOString();
                    hasChanges = true;
                    totalApplicationsUpdated++;
                } else {
                    console.log(`  - Application ${index + 1} already has valid date: ${app.appliedAt}`);
                }
            });

            // Update user if applications changed
            if (hasChanges) {
                await user.save();
                totalUsersUpdated++;
                console.log(`  - Updated user applications`);
            } else {
                console.log(`  - No changes needed for this user`);
            }
        }

        console.log('\n=== FIXING COMPLETE ===');
        console.log(`Total applications updated: ${totalApplicationsUpdated}`);
        console.log(`Total users updated: ${totalUsersUpdated}`);
        console.log('Application dates are now fixed!');

    } catch (error) {
        console.error('Error fixing application dates:', error);
    } finally {
        await mongoose.disconnect();
    }
};

fixApplicationDates();
