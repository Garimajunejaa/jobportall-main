import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Public route for getting all companies (no authentication required)
router.route("/get").get(getCompany);
router.route("/debug").get(getCompany); // Debug endpoint

// Protected routes
router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);

export default router;