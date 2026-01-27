import express from "express";
import { 
  getProfile, 
  updateProfile, 
  getUsers, 
  updateUserAdmin 
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/Self Routes
router.get("/profile", protect, getProfile);
router.put("/update", protect, updateProfile); // For EditProfilePage

// Admin-only Routes
router.get("/", protect, isAdmin, getUsers); // For MemberManagement
router.put("/:id", protect, isAdmin, updateUserAdmin); // For Promote/Suspend

export default router;