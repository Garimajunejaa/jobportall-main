import mongoose from 'mongoose';
import { Job } from './models/job.model.js';
import { Company } from './models/company.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check companies
        const companies = await Company.find();
        console.log(`📊 Found ${companies.length} companies`);
        companies.forEach((company, index) => {
            console.log(`  ${index + 1}. ${company.name} (${company.location})`);
        });

        // Check jobs
        const jobs = await Job.find().populate('company', 'name logo location');
        console.log(`\n📊 Found ${jobs.length} jobs`);
        jobs.forEach((job, index) => {
            console.log(`  ${index + 1}. ${job.title} at ${job.company.name} - ${job.location} - $${job.salary}`);
        });

        // Check if there are any jobs with company population issues
        const jobsWithoutCompany = await Job.find({ company: { $exists: true } });
        console.log(`\n📊 Jobs with company reference: ${jobsWithoutCompany.length}`);

        if (jobs.length === 0) {
            console.log('\n❌ No jobs found! Database is empty.');
            console.log('💡 Run: node seed-all-jobs.js to populate the database');
        } else {
            console.log('\n✅ Database has data!');
        }

    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkDatabase();
