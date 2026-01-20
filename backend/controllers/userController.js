import User from "../models/User.js";
import Blog from "../models/Blog.js";

export const getProfile = async (req, res) => {
  try {
    // fetch user without password
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // count how many blogs user has written
    const blogsCount = await Blog.countDocuments({
      author: req.user._id,
    });

    // calculate total likes on user's blogs
    const likesData = await Blog.aggregate([
      { $match: { author: req.user._id } },
      {
        $project: {
          likesCount: {
            $size: { $ifNull: ["$likes", []] },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likesCount" },
        },
      },
    ]);

    const likesCount = likesData[0]?.totalLikes || 0;

    // send combined response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      blogsCount,
      likesCount,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user profile",
    });
  }
};
