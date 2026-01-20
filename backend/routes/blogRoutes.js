import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  likeBlog,
  commentBlog,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);

router.post(
  "/",
  protect,
  upload.single("image"),
  createBlog
);

router.post("/:id/like", protect, likeBlog);
router.post("/:id/comment", protect, commentBlog);

export default router;
