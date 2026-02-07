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
    res.json({ message: "Backend is working!", timestamp: new Date().toISOString() });
});

export default router;