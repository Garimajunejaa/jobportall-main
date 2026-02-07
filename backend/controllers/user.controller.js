import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from 'fs';
import path from 'path';
import getDataUri from "../utils/datauri.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
    try {
        console.log('=== REGISTRATION START ===');
        console.log('Request body:', req.body);
        
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        // Check environment variables
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not set in environment');
            return res.status(500).json({
                message: "Database configuration error",
                success: false
            });
        }
        
        if (!process.env.SECRET_KEY) {
            console.error('SECRET_KEY not set in environment');
            return res.status(500).json({
                message: "Server configuration error", 
                success: false
            });
        }
        
        // Check only required fields
        if (!fullname || !email || !password || !role) {
            return res.status(400).json({
                message: "Please fill all required fields (name, email, password, role)",
                success: false
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
                success: false
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).exec();
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname: fullname.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
            phoneNumber: phoneNumber?.trim() || "",
            profile: {
                profilePhoto: ""
            }
        });

        // Remove password from response
        const { password: newPassword, ...userWithoutPassword } = newUser;
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        // Set secure HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });

        // Return success response without password
        res.status(201).json({
            message: "Registration successful",
            success: true,
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                profile: newUser.profile
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: error.message || 'Registration failed',
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: false, sameSite: 'lax' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            token,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        console.log('=== PROFILE UPDATE START ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file ? req.file.originalname : 'No file');
        console.log('User ID:', req.id);

        const { fullname, email, phoneNumber, bio, skills, location, company, position, linkedIn, twitter, github, website } = req.body;
        const userId = req.id;

        let user = await User.findById(userId);
        if (!user) {
            console.log('ERROR: User not found');
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        console.log('User found:', user._id);

        // Handle file upload only if a file is present
        if (req.file) {
            console.log('Processing file upload:', req.file.originalname, req.file.mimetype);
            
            // Validate file type and size
            const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                console.log('ERROR: Invalid file type:', req.file.mimetype);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type. Only PDF and image files are allowed.'
                });
            }
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (req.file.size > maxSize) {
                console.log('ERROR: File too large:', req.file.size);
                return res.status(400).json({
                    success: false,
                    message: 'File size exceeds 5MB limit.'
                });
            }

            try {
                // Create uploads directory if it doesn't exist
                const uploadsDir = path.join(process.cwd(), 'uploads');
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                    console.log('Created uploads directory:', uploadsDir);
                }

                // Generate unique filename to avoid conflicts
                const timestamp = Date.now();
                const randomString = Math.random().toString(36).substring(2, 8);
                const uniqueFilename = `${timestamp}_${randomString}_${req.file.originalname}`;
                const filePath = path.join(uploadsDir, uniqueFilename);

                // Save file to local filesystem
                fs.writeFileSync(filePath, req.file.buffer);
                console.log('File saved locally:', filePath);

                // Store file path in database
                const fileUrl = `/api/v1/files/${uniqueFilename}`;
                
                // Update resume or profile photo based on mimetype
                if (req.file.mimetype === 'application/pdf') {
                    user.profile.resume = fileUrl;
                    user.profile.resumeOriginalName = req.file.originalname;
                    console.log('Resume updated:', fileUrl);
                } else {
                    user.profile.profilePhoto = fileUrl;
                    console.log('Profile photo updated:', fileUrl);
                }
            } catch (fileError) {
                console.log('ERROR: File save failed:', fileError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to save file",
                    error: fileError.message
                });
            }
        }

        // Update other fields
        console.log('Updating profile fields...');
        if (fullname) {
            user.fullname = fullname;
            console.log('Updated fullname:', fullname);
        }
        if (email) {
            user.email = email;
            console.log('Updated email:', email);
        }
        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
            console.log('Updated phoneNumber:', phoneNumber);
        }
        if (bio) {
            user.profile.bio = bio;
            console.log('Updated bio:', bio);
        }
        if (skills) {
            const skillsArray = skills.split(",").map(skill => skill.trim()).filter(skill => skill);
            user.profile.skills = skillsArray;
            console.log('Updated skills:', skillsArray);
        }
        if (location) {
            user.profile.location = location;
            console.log('Updated location:', location);
        }
        if (company) {
            user.profile.company = company;
            console.log('Updated company:', company);
        }
        if (position) {
            user.profile.position = position;
            console.log('Updated position:', position);
        }
        if (linkedIn) {
            user.profile.linkedIn = linkedIn;
            console.log('Updated linkedIn:', linkedIn);
        }
        if (twitter) {
            user.profile.twitter = twitter;
            console.log('Updated twitter:', twitter);
        }
        if (github) {
            user.profile.github = github;
            console.log('Updated github:', github);
        }
        if (website) {
            user.profile.website = website;
            console.log('Updated website:', website);
        }

        console.log('Saving user to database...');
        await user.save();
        console.log('User saved successfully');

        // Format user response
        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        console.log('=== PROFILE UPDATE SUCCESS ===');
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.log('=== PROFILE UPDATE ERROR ===');
        console.log('Error details:', error);
        console.log('Error stack:', error.stack);
        return res.status(500).json({
            message: "Failed to update profile",
            success: false,
            error: error.message
        });
    }
};
export const getUserApplications = async (req, res) => {
    try {
        const userId = req.userId || req.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        console.log('=== GET USER APPLICATIONS START ===');
        console.log('User ID:', userId);

        // Query applications directly from Application collection
        const applications = await Application.find({ applicant: userId })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    model: 'Company'
                }
            })
            .sort({ createdAt: -1 });

        console.log('Applications found:', applications.length);
        
        // Format the response to match frontend expectations
        const formattedApplications = applications.map(app => ({
            _id: app._id,
            status: app.status,
            appliedAt: app.createdAt || app.appliedAt,
            job: app.job ? {
                _id: app.job._id,
                title: app.job.title || 'Unknown Job',
                jobType: app.job.jobType || 'Not specified',
                location: app.job.location || 'Not specified',
                salary: app.job.salary || 'Not specified',
                company: app.job.company ? {
                    _id: app.job.company._id,
                    name: app.job.company.name || 'Unknown Company',
                    location: app.job.company.location || 'Not specified',
                    logo: app.job.company.logo || null
                } : {
                    _id: null,
                    name: 'Unknown Company',
                    location: 'Not specified',
                    logo: null
                }
            } : {
                _id: null,
                title: 'Unknown Job',
                jobType: 'Not specified',
                location: 'Not specified',
                salary: 'Not specified',
                company: {
                    _id: null,
                    name: 'Unknown Company',
                    location: 'Not specified',
                    logo: null
                }
            }
        }));

        console.log('Formatted applications:', formattedApplications.length);
        console.log('=== GET USER APPLICATIONS END ===');

        return res.status(200).json({
            success: true,
            applications: formattedApplications
        });

    } catch (error) {
        console.error('Get user applications error:', error);
        return res.status(500).json({
            success: false,
            message: "Error fetching applications",
            error: error.message
        });
    }
};