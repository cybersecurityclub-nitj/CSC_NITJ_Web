import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Cybersecurity");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // simple reading stats (frontend only)
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to publish a blog");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/blogs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to publish blog");
      }

      navigate("/blog");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-24">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-14">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Create <span className="text-cyan-400">Blog</span>
        </h1>
        <p className="text-gray-400 mt-3 max-w-xl text-sm sm:text-base">
          Share your cybersecurity insights with the CSC community.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT — EDITOR */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="
            bg-black/40 backdrop-blur-xl
            border border-cyan-500/20
            rounded-2xl p-6 sm:p-8
            space-y-7
            shadow-[0_0_40px_rgba(34,211,238,0.15)]
          "
        >
          <h2 className="text-lg font-black uppercase tracking-widest text-cyan-400">
            Writer Console
          </h2>

          {/* TITLE */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-gray-400">
              Blog Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a powerful title..."
              className="
                w-full mt-2 p-4 rounded-lg
                bg-black/50 border border-white/10
                text-white
                focus:border-cyan-400 outline-none
              "
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-gray-400">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                w-full mt-2 p-4 rounded-lg
                bg-black/50 border border-white/10
                text-white
                focus:border-cyan-400 outline-none
              "
            >
              <option>Cybersecurity</option>
              <option>Awareness</option>
              <option>Ethical Hacking</option>
              <option>AI & Tech</option>
            </select>
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-gray-400">
              Cover Image (optional)
            </label>

            <label className="
              mt-3 flex flex-col items-center justify-center
              border-2 border-dashed border-cyan-500/30
              rounded-xl p-6 cursor-pointer
              hover:border-cyan-400 transition
            ">
              <span className="text-sm text-gray-400">
                Click to upload image
              </span>
              <span className="text-[10px] text-gray-500 mt-1">
                JPG / PNG
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="mt-2 text-xs text-red-400 hover:underline"
              >
                Remove image
              </button>
            )}
          </div>

          {/* CONTENT */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-gray-400">
              Content
            </label>
            <textarea
              rows="9"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog here..."
              className="
                w-full mt-2 p-4 rounded-lg
                bg-black/50 border border-white/10
                text-white leading-relaxed
                focus:border-cyan-400 outline-none
              "
              required
            />
          </div>

          {/* STATS */}
          <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>Words: {words}</span>
            <span>Reading Time: {readTime} min</span>
          </div>

          {error && (
            <p className="text-red-400 text-xs font-semibold">
              ⚠️ {error}
            </p>
          )}

          {/* ACTION */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-4 rounded-lg
              bg-cyan-500 text-black
              font-black uppercase text-xs tracking-[0.25em]
              hover:bg-cyan-400
              disabled:opacity-60
              shadow-[0_0_25px_rgba(34,211,238,0.5)]
              transition
            "
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </motion.form>

        {/* RIGHT — PREVIEW */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="
            bg-black/30 backdrop-blur-xl
            border border-white/10
            rounded-2xl p-6 sm:p-8
            shadow-[0_0_30px_rgba(0,0,0,0.4)]
          "
        >
          <h2 className="text-lg font-black uppercase tracking-widest text-gray-300 mb-6">
            Live Preview
          </h2>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="
                w-full h-44 sm:h-56 object-cover
                rounded-xl mb-6
                border border-cyan-500/20
              "
            />
          )}

          {title || content ? (
            <>
              <span className="text-[10px] uppercase tracking-widest text-cyan-400">
                {category}
              </span>

              <h3 className="text-2xl sm:text-3xl font-black mt-3 mb-4">
                {title || "Blog Title"}
              </h3>

              <p className="text-gray-400 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                {content || "Your blog content will appear here..."}
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              Start typing to see live preview
            </p>
          )}
        </motion.div>
      </div>

      {/* FOOTER */}
      <p className="text-center text-xs text-gray-500 mt-20 tracking-wide">
        🛡️ Write responsibly • Educate ethically • CSC NITJ
      </p>
    </div>
  );
}
