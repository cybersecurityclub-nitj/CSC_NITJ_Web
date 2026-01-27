import User from "../models/User.js";
import Blog from "../models/Blog.js";

// @desc    Get user profile with blog stats
export const getProfile = async (req, res) => {
  try {
    // 1. Fetch user and ensure role/status are not excluded by accident
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Fetch stats for the dashboard
    const blogsCount = await Blog.countDocuments({ author: req.user._id });

    const likesData = await Blog.aggregate([
      { $match: { author: req.user._id } },
      { $project: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } },
    ]);

    // 3. Explicitly return the role and status for the frontend security gates
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,     // ✅ Explicitly providing role for ProtectedRoute
      status: user.status, // ✅ Explicitly providing status (e.g., active/suspended)
      bio: user.bio || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      blogsCount,
      likesCount: likesData[0]?.totalLikes || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// @desc    Update personal profile (Self)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.github = req.body.github || user.github;
      user.linkedin = req.body.linkedin || user.linkedin;

      const updatedUser = await user.save();
      res.json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// @desc    Get all users (Admin Only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Access denied" });
  }
};

// @desc    Admin update: Change role or status
export const updateUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = req.body.role || user.role;
      user.status = req.body.status || user.status;
      await user.save();
      res.json({ message: "User status updated" });
    }
  } catch (err) {
    res.status(500).json({ message: "Admin update failed" });
  }
};