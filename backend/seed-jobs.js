import mongoose from 'mongoose';
import { Job } from './models/job.model.js';
import { Company } from './models/company.model.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleJobs = [
    {
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences.",
        requirements: ["React", "TypeScript", "CSS", "JavaScript", "5+ years experience"],
        salary: 120000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "5",
        position: "Senior Developer",
        category: "technology"
    },
    {
        title: "Backend Engineer",
        description: "Join our backend team to build scalable APIs and services.",
        requirements: ["Node.js", "MongoDB", "Express", "API Design", "3+ years experience"],
        salary: 110000,
        location: "San Francisco, CA",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Backend Engineer",
        category: "technology"
    },
    {
        title: "UI/UX Designer",
        description: "Create beautiful and intuitive designs for our products.",
        requirements: ["Figma", "Adobe XD", "Design Systems", "Prototyping", "2+ years experience"],
        salary: 95000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Designer",
        category: "design"
    },
    {
        title: "Marketing Manager",
        description: "Lead our marketing efforts and help grow our user base.",
        requirements: ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "4+ years experience"],
        salary: 85000,
        location: "Chicago, IL",
        jobType: "full-time",
        experienceLevel: "4",
        position: "Marketing Manager",
        category: "marketing"
    },
    {
        title: "Data Scientist",
        description: "Analyze data and build machine learning models.",
        requirements: ["Python", "Machine Learning", "Statistics", "SQL", "3+ years experience"],
        salary: 130000,
        location: "Boston, MA",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Data Scientist",
        category: "technology"
    },
    {
        title: "Product Manager",
        description: "Drive product strategy and work with cross-functional teams.",
        requirements: ["Product Strategy", "Agile", "User Research", "Analytics", "5+ years experience"],
        salary: 115000,
        location: "Seattle, WA",
        jobType: "full-time",
        experienceLevel: "5",
        position: "Product Manager",
        category: "other"
    },
    {
        title: "DevOps Engineer",
        description: "Build and maintain our infrastructure and deployment pipelines.",
        requirements: ["Docker", "Kubernetes", "AWS", "CI/CD", "3+ years experience"],
        salary: 125000,
        location: "Austin, TX",
        jobType: "full-time",
        experienceLevel: "3",
        position: "DevOps Engineer",
        category: "technology"
    },
    {
        title: "Content Writer",
        description: "Create engaging content for our blog and marketing materials.",
        requirements: ["Content Writing", "SEO", "Blog Writing", "Social Media", "2+ years experience"],
        salary: 65000,
        location: "Remote",
        jobType: "part-time",
        experienceLevel: "2",
        position: "Content Writer",
        category: "marketing"
    }
];

const sampleCompanies = [
    {
        name: "TechCorp Solutions",
        description: "Leading technology company specializing in innovative software solutions.",
        website: "https://techcorp.com",
        location: "New York, NY",
        logo: "https://logo.clearbit.com/techcorp.com",
        userId: "507f1f77bcf86cd799439011" // Dummy user ID for seeding
    },
    {
        name: "DataDriven Analytics",
        description: "Data analytics company helping businesses make data-driven decisions.",
        website: "https://datadriven.com",
        location: "San Francisco, CA",
        logo: "https://logo.clearbit.com/datadriven.com",
        userId: "507f1f77bcf86cd799439011"
    },
    {
        name: "Creative Studios",
        description: "Design and marketing agency creating beautiful digital experiences.",
        website: "https://creativestudios.com",
        location: "Los Angeles, CA",
        logo: "https://logo.clearbit.com/creativestudios.com",
        userId: "507f1f77bcf86cd799439011"
    },
    {
        name: "CloudTech Systems",
        description: "Cloud infrastructure and DevOps consulting company.",
        website: "https://cloudtech.com",
        location: "Austin, TX",
        logo: "https://logo.clearbit.com/cloudtech.com",
        userId: "507f1f77bcf86cd799439011"
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Job.deleteMany({});
        await Company.deleteMany({});
        console.log('Cleared existing data');

        // Create companies
        const companies = [];
        for (const companyData of sampleCompanies) {
            const company = new Company(companyData);
            await company.save();
            companies.push(company);
        }
        console.log(`Created ${companies.length} companies`);

        // Create jobs
        const jobs = [];
        for (let i = 0; i < sampleJobs.length; i++) {
            const jobData = sampleJobs[i];
            const randomCompany = companies[Math.floor(Math.random() * companies.length)];
            
            const job = new Job({
                ...jobData,
                company: randomCompany._id,
                created_by: randomCompany._id,
                created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
                applications: []
            });
            
            await job.save();
            jobs.push(job);
        }
        console.log(`Created ${jobs.length} jobs`);

        console.log('✅ Database seeded successfully!');
        console.log(`📊 Summary: ${companies.length} companies, ${jobs.length} jobs`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedDatabase();
