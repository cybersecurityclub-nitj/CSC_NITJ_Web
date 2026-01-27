import Blog from "../models/Blog.js";

// Create a new blog post (default status: pending)
export const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Basic validation
    if (!title || !content || !category) {
      return res.status(400).json({
        message: "Title, content and category are required",
      });
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      author: req.user._id,
      image: req.file?.path || "",
      status: "pending",
    });

    // Populate author details before sending response
    const populatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "name email"
    );

    res.status(201).json(populatedBlog);
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({ message: "Blog creation failed" });
  }
};

// Fetch all approved blogs (public)
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "approved" })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// Fetch blogs created by the logged-in user
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user blogs" });
  }
};

// Fetch approved blogs of a specific user (public profile)
export const getUserBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    const blogs = await Blog.find({
      author: id,
      status: "approved",
    }).sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Get User Blogs Error:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// Fetch all pending blogs (admin use)
export const getPendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "pending" })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending blogs" });
  }
};

// Approve or reject a blog (admin moderation)
export const moderateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only allow valid moderation states
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("author", "name email");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Moderation failed" });
  }
};

// Fetch a single approved blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    // Only approved blogs are accessible publicly
    if (!blog || blog.status !== "approved") {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

// Like or unlike a blog (toggle)
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user._id.toString();

    // Toggle like based on existing state
    if (blog.likes.some((id) => id.toString() === userId)) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Like toggle failed" });
  }
};

// Add a comment to a blog
export const commentBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({
      user: req.user._id,
      text: req.body.text,
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Delete a comment (author or blog owner only)
export const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user._id.toString();

    const blog = await Blog.findById(blogId)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.find(
      (c) => c._id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment owner or blog owner can delete
    if (
      comment.user._id.toString() !== userId &&
      blog.author._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== commentId
    );

    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
