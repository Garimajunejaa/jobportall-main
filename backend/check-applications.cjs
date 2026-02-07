const mongoose = require('mongoose');
const User = require('./models/user.model.js');
const Job = require('./models/job.model.js');

async function checkApplications() {
    try {
        console.log('=== CHECKING APPLICATIONS DATA ===');
        await mongoose.connect('mongodb://garima22csu068:1fiAy7IdNV3MOjyA@cluster0-shard-00-00.vsvop.mongodb.net:27017/jp?ssl=true&authSource=admin');
        console.log('✅ MongoDB Connected');

        console.log('\n=== CHECKING USERS ===');
        const users = await User.find({});
        console.log('Total users:', users.length);

        for (const user of users) {
            console.log('\n--- USER ---');
            console.log('ID:', user._id);
            console.log('Name:', user.fullname);
            console.log('Email:', user.email);
            console.log('Applications:', user.applications);
            console.log('Applications length:', user.applications?.length || 0);
        }

        console.log('\n=== CHECKING JOBS ===');
        const jobs = await Job.find({});
        console.log('Total jobs:', jobs.length);

        for (const job of jobs) {
            console.log('\n--- JOB ---');
            console.log('ID:', job._id);
            console.log('Title:', job.title);
            console.log('Applications:', job.applications);
            console.log('Applications length:', job.applications?.length || 0);
        }

        console.log('\n=== CHECKING USER-JOB RELATIONSHIPS ===');
        for (const user of users) {
            if (user.applications && user.applications.length > 0) {
                for (const app of user.applications) {
                    console.log(`User ${user.fullname} applied for job:`, app.job);
                    console.log('Application status:', app.status);
                    console.log('Applied at:', app.appliedAt);
                    
                    // Check if job exists
                    const job = await Job.findById(app.job);
                    if (job) {
                        console.log('✅ Job found:', job.title);
                    } else {
                        console.log('❌ Job not found for ID:', app.job);
                    }
                }
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkApplications();
