const mongoose = require('mongoose');
const User = require('./models/user.model.js');
const Job = require('./models/job.model.js');

async function createTestApplication() {
    try {
        console.log('=== CONNECTING TO DATABASE ===');
        await mongoose.connect('mongodb://localhost:27017/jobportal');
        console.log('✅ MongoDB Connected');

        console.log('=== FINDING USERS ===');
        const users = await User.find({ role: 'student' });
        console.log('Students found:', users.length);

        console.log('=== FINDING JOBS ===');
        const jobs = await Job.find({});
        console.log('Jobs found:', jobs.length);

        if (users.length > 0 && jobs.length > 0) {
            const student = users[0];
            const job = jobs[0];
            
            console.log('=== CREATING TEST APPLICATION ===');
            console.log('Student:', student.fullname);
            console.log('Job:', job.title);
            
            // Check if already applied
            const alreadyApplied = student.applications.some(app => 
                app.job && app.job.toString() === job._id.toString()
            );
            
            if (alreadyApplied) {
                console.log('❌ Student already applied to this job');
            } else {
                // Add application to student
                student.applications.push({
                    job: job._id,
                    status: 'pending',
                    appliedAt: new Date()
                });
                
                await student.save();
                console.log('✅ Test application created successfully');
                
                // Add to job as well
                job.applications.push(student._id);
                await job.save();
                console.log('✅ Application added to job');
            }
            
            console.log('=== CHECKING FINAL STATE ===');
            const updatedStudent = await User.findById(student._id);
            console.log('Student applications count:', updatedStudent.applications.length);
            console.log('Student applications:', updatedStudent.applications);
        } else {
            console.log('❌ No users or jobs found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestApplication();
