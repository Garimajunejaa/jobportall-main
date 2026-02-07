import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: false  // Changed from true to false
    },
    password: {
        type: String,
        required: false  // Changed from true to false since we have default password
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:String}, // Changed from ObjectId to String
        position:{type:String}, // Added position field
        location:{type:String}, // Added location field
        linkedIn:{type:String}, // Added LinkedIn field
        twitter:{type:String}, // Added Twitter field
        github:{type:String}, // Added GitHub field
        website:{type:String}, // Added website field
        profilePhoto:{
            type:String,
            default:""
        }
    },
    applications: [{
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }]
},{timestamps:true});
export const User = mongoose.model('User', userSchema);