import express from "express";
import { 
    login, 
    logout, 
    register, 
    updateProfile,
    getUserApplications
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
 
const router = express.Router();

// Add error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.route("/register").post(asyncHandler(register));
router.route("/login").post(asyncHandler(login));
router.route("/logout").get(asyncHandler(logout));
router.route("/profile/update").post(isAuthenticated, singleUpload, asyncHandler(updateProfile));
router.route("/applications").get(isAuthenticated, asyncHandler(getUserApplications));

// Test route to verify backend is working
router.route("/test").get((req, res) => {
    res.json({ 
        message: "Backend is working!", 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        hasSecretKey: !!process.env.SECRET_KEY
    });
});

// Simple test route (no database)
router.route("/simple-test").get((req, res) => {
    res.json({
        message: "Simple test - working!",
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url
    });
});

// Debug route for registration
router.route("/debug").get((req, res) => {
    res.json({
        message: "Debug info",
        env: process.env.NODE_ENV,
        mongoUri: process.env.MONGODB_URI ? "Set" : "Not set",
        secretKey: process.env.SECRET_KEY ? "Set" : "Not set"
    });
});

export default router;