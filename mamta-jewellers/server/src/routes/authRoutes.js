import express from "express";
import { registerUser, loginUser, loginAdmin } from "../controllers/authController.js";
import { updateProfile } from "../controllers/authController.js";
import { protect,admin } from "../middleware/auth.js";
import { forgotPassword, verifyOtp } from "../controllers/authController.js";
import { createAdmin } from "../controllers/authController.js";


const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.put("/profile", protect, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/create-admin", protect, admin, createAdmin);

export default router;
