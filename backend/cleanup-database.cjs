const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function cleanupOrphanedApplications() {
    try {
        console.log('=== DATABASE CLEANUP START ===');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get the Application model
        const Application = require('./models/application.model.js');

        // Find all applications
        const allApplications = await Application.find({});
        console.log('Total applications found:', allApplications.length);

        // Get all jobs
        const allJobs = await Job.find({});
        const validJobIds = new Set(allJobs.map(job => job._id.toString()));

        // Find orphaned applications (applications where job doesn't exist)
        const orphanedApplications = allApplications.filter(app => 
            !validJobIds.has(app.job.toString())
        );

        console.log('Orphaned applications found:', orphanedApplications.length);

        if (orphanedApplications.length > 0) {
            console.log('Cleaning up orphaned applications...');
            
            // Delete orphaned applications
            const deleteResult = await Application.deleteMany({
                job: { $in: orphanedApplications.map(app => app.job) }
            });

            console.log('Deleted orphaned applications:', deleteResult.deletedCount);

            // Update user applications to remove invalid job references
            const User = require('./models/user.model.js');
            const userIds = [...new Set(orphanedApplications.map(app => app.applicant.toString()))];
            
            await User.updateMany(
                { _id: { $in: userIds } },
                { $pull: { applications: { $in: orphanedApplications.map(app => app._id) } } }
            );

            console.log('Updated user applications to remove orphaned references');
        } else {
            console.log('No orphaned applications found. Database is clean.');
        }

        console.log('=== DATABASE CLEANUP COMPLETE ===');
        process.exit(0);

    } catch (error) {
        console.error('Database cleanup error:', error);
        process.exit(1);
    }
}

// Run the cleanup
cleanupOrphanedApplications();
