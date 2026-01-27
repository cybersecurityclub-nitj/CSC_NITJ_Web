import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  likeBlog,
  commentBlog,
  getPendingBlogs,
  moderateBlog,
  deleteComment,
  getMyBlogs,
  getUserBlogs,
} from "../controllers/blogController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getBlogs);
router.get("/user/:id", getUserBlogs);

// Authenticated user routes
router.get("/user", protect, getMyBlogs);
router.post("/", protect, upload.single("image"), createBlog);
router.post("/:id/like", protect, likeBlog);
router.post("/:id/comment", protect, commentBlog);
router.delete("/:blogId/comment/:commentId", protect, deleteComment);

// Admin-only routes
router.get("/pending", protect, isAdmin, getPendingBlogs);
router.put("/moderate/:id", protect, isAdmin, moderateBlog);

// Blog detail route (kept last to avoid route conflicts)
router.get("/:id", getBlogById);

export default router;
