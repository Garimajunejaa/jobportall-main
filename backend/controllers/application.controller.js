import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import cloudinary, { generateSignedUrl } from "../utils/cloudinary.js";
import multer from "multer";
import streamifier from "streamifier";

const upload = multer();

export const applyJob = async (req, res) => {
    try {
        console.log('=== APPLY JOB START ===');
        const userId = req.id; // Assuming user ID is set in req.id by authentication middleware
        const jobId = req.params.id;
        console.log('User ID:', userId);
        console.log('Job ID:', jobId);

        // Check if user and job exist
        const user = await User.findById(userId);
        if (!user) {
            console.log('ERROR: User not found');
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            console.log('ERROR: Job not found');
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        console.log('User found:', user.fullname);
        console.log('Job found:', job.title);
        console.log('User role:', user.role);

        // Check if user is a student - only students can apply for jobs
        if (user.role !== 'student') {
            console.log('ERROR: User is not a student');
            return res.status(403).json({ 
                success: false, 
                message: "Only students can apply for jobs" 
            });
        }

        // Check if user already applied using Application model
        const existingApplication = await Application.findOne({
            applicant: userId,
            job: jobId
        });
        
        if (existingApplication) {
            console.log('ERROR: User already applied');
            return res.status(400).json({ success: false, message: "You have already applied for this job" });
        }

        // Create new application using Application model
        const application = new Application({
            applicant: userId,
            job: jobId,
            status: "pending",
            appliedAt: new Date()
        });

        await application.save();
        console.log('Application created successfully');
        console.log('Application ID:', application._id);

        // Add application reference to user and job (GitHub logic)
        user.applications.push(application._id);
        await user.save();
        console.log('Application added to user profile');

        job.applications.push(application._id);
        await job.save();
        console.log('Application added to job');

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application: application
        });

    } catch (error) {
        console.error('=== APPLY JOB ERROR ===');
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: "Error submitting application",
            error: error.message
        });
    }
};

export const getApplicants = async (req, res) => {
    try {
        console.log('=== GET APPLICANTS START ===');
        const jobId = req.params.id;
        const userId = req.id; // Current user ID from auth middleware
        console.log('Job ID:', jobId);
        console.log('Current User ID:', userId);

        // Try GitHub logic first - Job model applications array
        console.log('=== TRYING GITHUB LOGIC ===');
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            populate: {
                path: 'applicant',
                model: 'User'
            }
        });

        if (!job) {
            console.log('ERROR: Job not found');
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // CRITICAL SECURITY CHECK: Verify current user is the one who posted this job
        if (job.created_by.toString() !== userId.toString()) {
            console.log('ERROR: Unauthorized access - User did not post this job');
            console.log('Job posted by:', job.created_by);
            console.log('Current user:', userId);
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only view applicants for jobs you posted."
            });
        }

        console.log('✅ Authorization successful - User posted this job');
        console.log('Job found:', job?.title || 'Job title not available');
        console.log('Applications from job model:', job.applications);
        console.log('Applications count from job model:', job.applications?.length || 0);

        let applicationsWithSignedUrls = [];

        // If Job model has applications, use them
        if (job.applications && job.applications.length > 0) {
            console.log('=== USING JOB MODEL APPLICATIONS ===');
            applicationsWithSignedUrls = await Promise.all(job.applications.map(async (application) => {
                const applicant = application.applicant.toObject();
                if (applicant.profile && applicant.profile.resume) {
                    applicant.profile.signedResumeUrl = applicant.profile.resume;
                }
                return {
                    ...application.toObject(),
                    applicant
                };
            }));
        } else {
            console.log('=== FALLBACK: QUERYING APPLICATION COLLECTION ===');
            // Fallback: Query Application collection directly
            const jobObjectId = new mongoose.Types.ObjectId(jobId);
            const applications = await Application.find({ job: jobObjectId })
                .populate('applicant')
                .populate('job');

            console.log('Applications from collection:', applications);
            console.log('Applications count from collection:', applications.length);

            applicationsWithSignedUrls = applications.map(app => ({
                _id: app._id,
                status: app.status,
                appliedAt: app.appliedAt,
                applicant: {
                    _id: app.applicant._id,
                    fullname: app.applicant.fullname,
                    email: app.applicant.email,
                    phoneNumber: app.applicant.phoneNumber,
                    profile: {
                        ...app.applicant.profile,
                        signedResumeUrl: app.applicant.profile?.resume,
                        resumeOriginalName: app.applicant.profile?.resumeOriginalName
                    }
                }
            }));
        }

        console.log('=== FINAL RESULTS ===');
        console.log('Total applications found:', applicationsWithSignedUrls.length);
        console.log('Formatted applications:', applicationsWithSignedUrls);

        return res.status(200).json({
            success: true,
            applications: applicationsWithSignedUrls
        });
    } catch (error) {
        console.error('=== GET APPLICANTS ERROR ===');
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: "Error fetching applicants",
            error: error.message
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id; // Assuming user ID is set in req.id by authentication middleware

        // Find applications by user and populate job and company details
        const applications = await Application.find({ applicant: userId })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    model: 'Company'
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        console.log('=== UPDATE STATUS START ===');
        const applicationId = req.params.id;
        const { status } = req.body;
        const userId = req.id; // Current user ID from auth middleware
        
        console.log('Application ID:', applicationId);
        console.log('New Status:', status);
        console.log('Current User ID:', userId);

        if (!['accepted', 'rejected'].includes(status.toLowerCase())) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        // Find application in Application collection
        const application = await Application.findById(applicationId).populate('job');
        if (!application) {
            console.log('ERROR: Application not found in Application collection');
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // CRITICAL SECURITY CHECK: Verify current user is the one who posted the job
        if (application.job.created_by.toString() !== userId.toString()) {
            console.log('ERROR: Unauthorized status update - User did not post this job');
            console.log('Job posted by:', application.job.created_by);
            console.log('Current user:', userId);
            console.log('Job title:', application.job.title);
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only update status for applications to jobs you posted."
            });
        }

        console.log('✅ Authorization successful - User posted this job');
        console.log('Job title:', application.job.title);
        
        const oldStatus = application.status;
        application.status = status.toLowerCase();
        
        await application.save();
        
        console.log('Status updated from', oldStatus, 'to', application.status);
        console.log('=== UPDATE STATUS SUCCESS ===');

        return res.status(200).json({ 
            success: true, 
            message: `Application status updated to ${status}` 
        });
    } catch (error) {
        console.error('=== UPDATE STATUS ERROR ===');
        console.error('Error updating application status:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto", folder: "resumes" },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);

        // Save the result.secure_url and original filename to the user profile
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        user.profile.resume = result.secure_url;
        user.profile.resumeOriginalName = req.file.originalname;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resumeUrl: result.secure_url,
            resumeOriginalName: req.file.originalname
        });
    } catch (error) {
        console.error("Error uploading resume:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload resume"
        });
    }
};

export const getAllApplications = async (req, res) => {
    try {
        console.log('=== GET ALL APPLICATIONS START ===');
        
        // Find all applications and populate job and applicant details
        const applications = await Application.find({})
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    model: 'Company'
                }
            })
            .populate({
                path: 'applicant',
                select: 'fullname email phoneNumber profile'
            })
            .sort({ createdAt: -1 });

        console.log('Applications found:', applications.length);
        
        return res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.error("Error fetching all applications:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
