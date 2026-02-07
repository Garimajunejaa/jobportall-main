import mongoose from 'mongoose';
import { Job } from './models/job.model.js';
import { Company } from './models/company.model.js';
import dotenv from 'dotenv';

dotenv.config();

const allCompanies = [
    {
        name: "TechCorp Solutions",
        description: "Leading technology company specializing in innovative software solutions.",
        website: "https://techcorp.com",
        location: "New York, NY",
        logo: "https://logo.clearbit.com/techcorp.com",
        userId: "507f1f77bcf86cd799439011"
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
    },
    {
        name: "FinanceHub",
        description: "Financial technology company revolutionizing digital banking.",
        website: "https://financehub.com",
        location: "Chicago, IL",
        logo: "https://logo.clearbit.com/financehub.com",
        userId: "507f1f77bcf86cd799439011"
    },
    {
        name: "HealthTech Innovations",
        description: "Healthcare technology company improving patient outcomes.",
        website: "https://healthtech.com",
        location: "Boston, MA",
        logo: "https://logo.clearbit.com/healthtech.com",
        userId: "507f1f77bcf86cd799439011"
    },
    {
        name: "EduTech Solutions",
        description: "Educational technology company making learning accessible.",
        website: "https://edutech.com",
        location: "Seattle, WA",
        logo: "https://logo.clearbit.com/edutech.com",
        userId: "507f1f77bcf86cd799439011"
    },
    {
        name: "RetailTech Pro",
        description: "Retail technology company transforming shopping experiences.",
        website: "https://retailtech.com",
        location: "Miami, FL",
        logo: "https://logo.clearbit.com/retailtech.com",
        userId: "507f1f77bcf86cd799439011"
    }
];

const allJobs = [
    // Technology Jobs
    {
        title: "Senior Frontend Developer",
        description: "We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences with React and modern web technologies.",
        requirements: ["React", "TypeScript", "CSS", "JavaScript", "5+ years experience", "REST APIs"],
        salary: 120000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "5",
        position: "Senior Developer",
        category: "technology",
        isFeatured: true
    },
    {
        title: "Backend Engineer",
        description: "Join our backend team to build scalable APIs and services using Node.js and modern database technologies.",
        requirements: ["Node.js", "MongoDB", "Express", "API Design", "3+ years experience", "Microservices"],
        salary: 110000,
        location: "San Francisco, CA",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Backend Engineer",
        category: "technology"
    },
    {
        title: "Full Stack Developer",
        description: "Looking for a versatile Full Stack Developer who can work across the entire technology stack.",
        requirements: ["React", "Node.js", "MongoDB", "TypeScript", "4+ years experience", "AWS"],
        salary: 105000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "4",
        position: "Full Stack Developer",
        category: "technology",
        isFeatured: true
    },
    {
        title: "DevOps Engineer",
        description: "Build and maintain our infrastructure and deployment pipelines using modern DevOps practices.",
        requirements: ["Docker", "Kubernetes", "AWS", "CI/CD", "3+ years experience", "Terraform"],
        salary: 125000,
        location: "Austin, TX",
        jobType: "full-time",
        experienceLevel: "3",
        position: "DevOps Engineer",
        category: "technology"
    },
    {
        title: "Mobile App Developer",
        description: "Create amazing mobile applications for iOS and Android platforms.",
        requirements: ["React Native", "iOS", "Android", "JavaScript", "3+ years experience", "Mobile UI"],
        salary: 115000,
        location: "San Francisco, CA",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Mobile Developer",
        category: "technology"
    },
    {
        title: "Data Scientist",
        description: "Analyze data and build machine learning models to drive business insights.",
        requirements: ["Python", "Machine Learning", "Statistics", "SQL", "3+ years experience", "TensorFlow"],
        salary: 130000,
        location: "Boston, MA",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Data Scientist",
        category: "technology",
        isFeatured: true
    },
    {
        title: "Machine Learning Engineer",
        description: "Build and deploy machine learning models at scale.",
        requirements: ["Python", "TensorFlow", "PyTorch", "AWS", "4+ years experience", "Deep Learning"],
        salary: 140000,
        location: "Seattle, WA",
        jobType: "full-time",
        experienceLevel: "4",
        position: "ML Engineer",
        category: "technology"
    },
    {
        title: "QA Engineer",
        description: "Ensure quality and reliability of our software products through comprehensive testing.",
        requirements: ["Testing", "Automation", "Selenium", "Jest", "2+ years experience", "Agile"],
        salary: 85000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "QA Engineer",
        category: "technology"
    },
    {
        title: "Security Engineer",
        description: "Protect our systems and data from cyber threats.",
        requirements: ["Cybersecurity", "Network Security", "Penetration Testing", "2+ years experience", "SIEM"],
        salary: 110000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "2",
        position: "Security Engineer",
        category: "technology"
    },
    {
        title: "Cloud Architect",
        description: "Design and implement scalable cloud infrastructure solutions.",
        requirements: ["AWS", "Azure", "Cloud Architecture", "5+ years experience", "Enterprise Systems"],
        salary: 150000,
        location: "Chicago, IL",
        jobType: "full-time",
        experienceLevel: "5",
        position: "Cloud Architect",
        category: "technology",
        isFeatured: true
    },

    // Design Jobs
    {
        title: "UI/UX Designer",
        description: "Create beautiful and intuitive designs for our products.",
        requirements: ["Figma", "Adobe XD", "Design Systems", "Prototyping", "2+ years experience", "User Research"],
        salary: 95000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Designer",
        category: "design"
    },
    {
        title: "Product Designer",
        description: "Lead the design of our products from concept to launch.",
        requirements: ["Product Design", "Figma", "User Research", "Design Thinking", "3+ years experience", "Prototyping"],
        salary: 110000,
        location: "Los Angeles, CA",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Product Designer",
        category: "design",
        isFeatured: true
    },
    {
        title: "Graphic Designer",
        description: "Create stunning visual designs for marketing and branding.",
        requirements: ["Adobe Creative Suite", "Photoshop", "Illustrator", "2+ years experience", "Branding"],
        salary: 75000,
        location: "Miami, FL",
        jobType: "part-time",
        experienceLevel: "2",
        position: "Graphic Designer",
        category: "design"
    },
    {
        title: "Motion Designer",
        description: "Create engaging animations and motion graphics.",
        requirements: ["After Effects", "Premiere Pro", "Animation", "2+ years experience", "Video Production"],
        salary: 85000,
        location: "Remote",
        jobType: "freelance",
        experienceLevel: "2",
        position: "Motion Designer",
        category: "design"
    },

    // Marketing Jobs
    {
        title: "Marketing Manager",
        description: "Lead our marketing efforts and help grow our user base.",
        requirements: ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "4+ years experience", "Team Management"],
        salary: 85000,
        location: "Chicago, IL",
        jobType: "full-time",
        experienceLevel: "4",
        position: "Marketing Manager",
        category: "marketing"
    },
    {
        title: "Content Writer",
        description: "Create engaging content for our blog and marketing materials.",
        requirements: ["Content Writing", "SEO", "Blog Writing", "Social Media", "2+ years experience", "Copywriting"],
        salary: 65000,
        location: "Remote",
        jobType: "part-time",
        experienceLevel: "2",
        position: "Content Writer",
        category: "marketing"
    },
    {
        title: "Social Media Manager",
        description: "Manage our social media presence and engage with our community.",
        requirements: ["Social Media", "Content Creation", "Analytics", "2+ years experience", "Community Management"],
        salary: 70000,
        location: "Los Angeles, CA",
        jobType: "full-time",
        experienceLevel: "2",
        position: "Social Media Manager",
        category: "marketing"
    },
    {
        title: "SEO Specialist",
        description: "Improve our search engine rankings and drive organic traffic.",
        requirements: ["SEO", "Google Analytics", "Keyword Research", "2+ years experience", "Content Strategy"],
        salary: 75000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "SEO Specialist",
        category: "marketing"
    },
    {
        title: "Growth Hacker",
        description: "Drive rapid growth through innovative marketing strategies.",
        requirements: ["Growth Marketing", "A/B Testing", "Analytics", "2+ years experience", "Viral Marketing"],
        salary: 90000,
        location: "San Francisco, CA",
        jobType: "full-time",
        experienceLevel: "2",
        position: "Growth Hacker",
        category: "marketing",
        isFeatured: true
    },

    // Finance Jobs
    {
        title: "Financial Analyst",
        description: "Analyze financial data and provide insights for business decisions.",
        requirements: ["Excel", "Financial Modeling", "Accounting", "2+ years experience", "Data Analysis"],
        salary: 80000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "2",
        position: "Financial Analyst",
        category: "finance"
    },
    {
        title: "Investment Banker",
        description: "Help companies raise capital and navigate complex financial transactions.",
        requirements: ["Finance", "Investment Banking", "Excel", "3+ years experience", "Financial Modeling"],
        salary: 150000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Investment Banker",
        category: "finance",
        isFeatured: true
    },
    {
        title: "Accountant",
        description: "Manage our financial records and ensure compliance.",
        requirements: ["Accounting", "Excel", "Financial Reporting", "2+ years experience", "Tax Preparation"],
        salary: 70000,
        location: "Chicago, IL",
        jobType: "full-time",
        experienceLevel: "2",
        position: "Accountant",
        category: "finance"
    },

    // Other Jobs
    {
        title: "Product Manager",
        description: "Drive product strategy and work with cross-functional teams.",
        requirements: ["Product Strategy", "Agile", "User Research", "Analytics", "5+ years experience", "Roadmapping"],
        salary: 115000,
        location: "Seattle, WA",
        jobType: "full-time",
        experienceLevel: "5",
        position: "Product Manager",
        category: "other"
    },
    {
        title: "Project Manager",
        description: "Manage projects and ensure timely delivery of high-quality results.",
        requirements: ["Project Management", "Agile", "Scrum", "3+ years experience", "Team Leadership"],
        salary: 95000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "3",
        position: "Project Manager",
        category: "other"
    },
    {
        title: "HR Manager",
        description: "Manage our human resources and build a great company culture.",
        requirements: ["HR Management", "Recruiting", "Employee Relations", "3+ years experience", "HRIS"],
        salary: 85000,
        location: "Los Angeles, CA",
        jobType: "full-time",
        experienceLevel: "3",
        position: "HR Manager",
        category: "other"
    },
    {
        title: "Customer Success Manager",
        description: "Ensure our customers get the most value from our products.",
        requirements: ["Customer Success", "Account Management", "Communication", "2+ years experience", "SaaS"],
        salary: 80000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Customer Success Manager",
        category: "other"
    },
    {
        title: "Sales Representative",
        description: "Drive sales growth and build relationships with clients.",
        requirements: ["Sales", "CRM", "Communication", "1+ years experience", "Negotiation"],
        salary: 60000,
        location: "Miami, FL",
        jobType: "full-time",
        experienceLevel: "1",
        position: "Sales Representative",
        category: "other"
    },
    {
        title: "Business Analyst",
        description: "Analyze business processes and recommend improvements.",
        requirements: ["Business Analysis", "Process Improvement", "Data Analysis", "2+ years experience", "Requirements Gathering"],
        salary: 85000,
        location: "Chicago, IL",
        jobType: "full-time",
        experienceLevel: "2",
        position: "Business Analyst",
        category: "other"
    },
    {
        title: "Technical Writer",
        description: "Create technical documentation and user guides.",
        requirements: ["Technical Writing", "API Documentation", "User Manuals", "2+ years experience", "Markdown"],
        salary: 75000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Technical Writer",
        category: "other"
    },
    {
        title: "Research Analyst",
        description: "Conduct market research and provide strategic insights.",
        requirements: ["Market Research", "Data Analysis", "Statistics", "2+ years experience", "Report Writing"],
        salary: 70000,
        location: "Boston, MA",
        jobType: "full-time",
        experienceLevel: "2",
        position: "Research Analyst",
        category: "other"
    },
    {
        title: "Operations Manager",
        description: "Oversee daily operations and improve efficiency.",
        requirements: ["Operations Management", "Process Optimization", "Leadership", "3+ years experience", "Supply Chain"],
        salary: 90000,
        location: "Austin, TX",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Operations Manager",
        category: "other"
    },
    {
        title: "Legal Counsel",
        description: "Provide legal guidance and ensure compliance.",
        requirements: ["Law Degree", "Corporate Law", "Contract Law", "3+ years experience", "Legal Research"],
        salary: 120000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Legal Counsel",
        category: "other"
    },
    {
        title: "Data Analyst",
        description: "Analyze data to provide business insights and recommendations.",
        requirements: ["SQL", "Excel", "Data Visualization", "2+ years experience", "Statistical Analysis"],
        salary: 75000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Data Analyst",
        category: "other"
    },
    {
        title: "UX Researcher",
        description: "Conduct user research to inform product design decisions.",
        requirements: ["User Research", "Usability Testing", "Data Analysis", "2+ years experience", "Qualitative Research"],
        salary: 90000,
        location: "Seattle, WA",
        jobType: "full-time",
        experienceLevel: "2",
        position: "UX Researcher",
        category: "other"
    },
    {
        title: "Game Developer",
        description: "Create engaging games for mobile and web platforms.",
        requirements: ["Unity", "C#", "Game Development", "2+ years experience", "3D Graphics"],
        salary: 95000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Game Developer",
        category: "other"
    },
    {
        title: "Blockchain Developer",
        description: "Develop blockchain applications and smart contracts.",
        requirements: ["Blockchain", "Solidity", "Web3", "2+ years experience", "Smart Contracts"],
        salary: 130000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Blockchain Developer",
        category: "technology",
        isFeatured: true
    },
    {
        title: "AI Engineer",
        description: "Build and deploy AI-powered applications.",
        requirements: ["Python", "Machine Learning", "Deep Learning", "3+ years experience", "Neural Networks"],
        salary: 145000,
        location: "San Francisco, CA",
        jobType: "full-time",
        experienceLevel: "3",
        position: "AI Engineer",
        category: "technology",
        isFeatured: true
    },
    {
        title: "Cybersecurity Analyst",
        description: "Monitor and protect our systems from security threats.",
        requirements: ["Cybersecurity", "SIEM", "Security Tools", "2+ years experience", "Incident Response"],
        salary: 95000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "2",
        position: "Cybersecurity Analyst",
        category: "technology"
    },
    {
        title: "Database Administrator",
        description: "Manage and optimize our database systems.",
        requirements: ["SQL", "MongoDB", "Database Administration", "3+ years experience", "Performance Tuning"],
        salary: 95000,
        location: "Chicago, IL",
        jobType: "full-time",
        experienceLevel: "3",
        position: "DBA",
        category: "technology"
    },
    {
        title: "API Developer",
        description: "Design and build RESTful APIs for our applications.",
        requirements: ["API Development", "REST", "Node.js", "2+ years experience", "API Documentation"],
        salary: 90000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "API Developer",
        category: "technology"
    },
    {
        title: "Embedded Systems Engineer",
        description: "Develop software for embedded systems and IoT devices.",
        requirements: ["C/C++", "Embedded Systems", "IoT", "3+ years experience", "Hardware Integration"],
        salary: 105000,
        location: "Austin, TX",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Embedded Engineer",
        category: "technology"
    },
    {
        title: "Technical Support Engineer",
        description: "Provide technical support to our customers.",
        requirements: ["Technical Support", "Customer Service", "Troubleshooting", "2+ years experience", "IT Support"],
        salary: 65000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Support Engineer",
        category: "other"
    },
    {
        title: "Solutions Architect",
        description: "Design comprehensive solutions for enterprise clients.",
        requirements: ["Enterprise Architecture", "Cloud Solutions", "5+ years experience", "System Design"],
        salary: 160000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "5",
        position: "Solutions Architect",
        category: "technology",
        isFeatured: true
    },
    {
        title: "Video Editor",
        description: "Create and edit engaging video content.",
        requirements: ["Video Editing", "Adobe Premiere", "After Effects", "2+ years experience", "Content Creation"],
        salary: 60000,
        location: "Los Angeles, CA",
        jobType: "part-time",
        experienceLevel: "2",
        position: "Video Editor",
        category: "design"
    },
    {
        title: "3D Designer",
        description: "Create 3D models and designs for various applications.",
        requirements: ["3D Modeling", "Blender", "AutoCAD", "2+ years experience", "3D Animation"],
        salary: 80000,
        location: "Remote",
        jobType: "freelance",
        experienceLevel: "2",
        position: "3D Designer",
        category: "design"
    },
    {
        title: "Brand Manager",
        description: "Develop and execute brand strategies.",
        requirements: ["Brand Management", "Marketing", "Strategy", "3+ years experience", "Brand Development"],
        salary: 95000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Brand Manager",
        category: "marketing"
    },
    {
        title: "Email Marketing Specialist",
        description: "Create and manage email marketing campaigns.",
        requirements: ["Email Marketing", "Mailchimp", "Copywriting", "2+ years experience", "Campaign Management"],
        salary: 65000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Email Marketing Specialist",
        category: "marketing"
    },
    {
        title: "E-commerce Manager",
        description: "Manage our e-commerce platform and online sales.",
        requirements: ["E-commerce", "Shopify", "Digital Marketing", "3+ years experience", "Online Sales"],
        salary: 85000,
        location: "Miami, FL",
        jobType: "full-time",
        experienceLevel: "3",
        position: "E-commerce Manager",
        category: "marketing"
    },
    {
        title: "Risk Analyst",
        description: "Identify and mitigate financial and operational risks.",
        requirements: ["Risk Management", "Financial Analysis", "Compliance", "3+ years experience", "Risk Assessment"],
        salary: 90000,
        location: "Chicago, IL",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Risk Analyst",
        category: "finance"
    },
    {
        title: "Tax Specialist",
        description: "Handle tax planning and compliance for the organization.",
        requirements: ["Tax Preparation", "Tax Law", "Accounting", "3+ years experience", "Tax Consulting"],
        salary: 85000,
        location: "New York, NY",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Tax Specialist",
        category: "finance"
    },
    {
        title: "Compliance Officer",
        description: "Ensure regulatory compliance across all business operations.",
        requirements: ["Compliance", "Regulatory Affairs", "Risk Management", "3+ years experience", "Legal Compliance"],
        salary: 95000,
        location: "Boston, MA",
        jobType: "full-time",
        experienceLevel: "3",
        position: "Compliance Officer",
        category: "finance"
    },
    {
        title: "Scrum Master",
        description: "Facilitate Agile development processes and team collaboration.",
        requirements: ["Scrum", "Agile", "Team Facilitation", "2+ years experience", "Project Management"],
        salary: 90000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Scrum Master",
        category: "other"
    },
    {
        title: "Training Specialist",
        description: "Develop and deliver training programs for employees.",
        requirements: ["Training", "Instructional Design", "Communication", "2+ years experience", "E-learning"],
        salary: 70000,
        location: "Remote",
        jobType: "remote",
        experienceLevel: "2",
        position: "Training Specialist",
        category: "other"
    },
    {
        title: "Consultant",
        description: "Provide expert consulting services to clients.",
        requirements: ["Consulting", "Problem Solving", "Communication", "5+ years experience", "Client Management"],
        salary: 120000,
        location: "Remote",
        jobType: "contract",
        experienceLevel: "5",
        position: "Consultant",
        category: "other"
    },
    {
        title: "Entrepreneur in Residence",
        description: "Join our startup incubator program to launch your own venture.",
        requirements: ["Entrepreneurship", "Business Planning", "Leadership", "3+ years experience", "Startup Experience"],
        salary: 80000,
        location: "San Francisco, CA",
        jobType: "contract",
        experienceLevel: "3",
        position: "Entrepreneur",
        category: "other",
        isFeatured: true
    }
];

async function seedAllDatabase() {
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
        for (const companyData of allCompanies) {
            const company = new Company(companyData);
            await company.save();
            companies.push(company);
        }
        console.log(`Created ${companies.length} companies`);

        // Create jobs
        const jobs = [];
        for (let i = 0; i < allJobs.length; i++) {
            const jobData = allJobs[i];
            const randomCompany = companies[Math.floor(Math.random() * companies.length)];
            
            const job = new Job({
                ...jobData,
                company: randomCompany._id,
                created_by: randomCompany._id,
                created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date within last 60 days
                applications: []
            });
            
            await job.save();
            jobs.push(job);
        }
        console.log(`Created ${jobs.length} jobs`);

        // Count jobs by category
        const jobCounts = {};
        jobs.forEach(job => {
            jobCounts[job.category] = (jobCounts[job.category] || 0) + 1;
        });

        console.log('✅ Database seeded successfully!');
        console.log(`📊 Summary: ${companies.length} companies, ${jobs.length} jobs`);
        console.log('\n📈 Jobs by category:');
        Object.entries(jobCounts).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} jobs`);
        });

        console.log('\n🎯 Featured jobs:', jobs.filter(job => job.isFeatured).length);
        console.log('🏠 Remote jobs:', jobs.filter(job => job.location === 'Remote').length);
        console.log('💼 Full-time jobs:', jobs.filter(job => job.jobType === 'full-time').length);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedAllDatabase();
