import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
      image: req.file?.path || "",
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error("Create blog error:", err.message);
    res.status(500).json({
      message: "Blog creation failed",
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch blogs",
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name")
      .populate("comments.user", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};


export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!blog.likes.includes(req.user._id)) {
      blog.likes.push(req.user._id);
      await blog.save();
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({
      message: "Failed to like blog",
    });
  }
};

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
    res.status(500).json({
      message: "Failed to add comment",
    });
  }
};
