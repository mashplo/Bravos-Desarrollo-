import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// GET /api/profile - Get current user profile
router.get("/profile", verifyToken, getProfile);

// PUT /api/profile - Update current user profile
router.put("/profile", verifyToken, updateProfile);

export default router;