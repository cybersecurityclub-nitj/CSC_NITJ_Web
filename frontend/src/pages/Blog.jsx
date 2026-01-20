import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import blogImg from "../assets/blog.png";


const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="group cursor-pointer border-b border-slate-800 pb-8 mb-8"
    >
      {/* AUTHOR */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center text-[11px] text-black font-bold">
          {blog.author?.name?.[0] || "U"}
        </div>
        <span className="text-xs text-white font-medium">
          {blog.author?.name || "Unknown"}
        </span>
        <span className="text-xs text-slate-500">
          · {new Date(blog.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* CONTENT ROW */}
      <div className="flex gap-4 items-start">
        {/* LEFT TEXT */}
        <div className="flex-1">
          <h2 className="text-lg sm:text-2xl font-black text-white group-hover:text-cyan-400 transition mb-2 leading-snug">
            {blog.title}
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
            {blog.content}
          </p>

          <div className="flex gap-5 text-[11px] text-slate-500 font-mono">
            <span>♥ {blog.likes?.length || 0}</span>
            <span>💬 {blog.comments?.length || 0}</span>
          </div>
        </div>

        {blog.image && (
          <div className="w-24 h-20 sm:w-36 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border border-slate-800">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};


export default function Blog() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/blogs`
        );
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Blog fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const img = new Image();
    img.src = blogImg;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * canvas.width,
        y: ((e.clientY - rect.top) / rect.height) * canvas.height,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    img.onload = () => {
      const width = window.innerWidth < 768 ? 320 : 900;
      const height = (img.height / img.width) * width;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const data = ctx.getImageData(0, 0, width, height).data;
      ctx.clearRect(0, 0, width, height);

      const particles = [];

      for (let y = 0; y < height; y += 3) {
        for (let x = 0; x < width; x += 3) {
          const i = (y * width + x) * 4;
          if (data[i + 3] > 120) {
            particles.push({
              x,
              y: Math.random() > 0.5 ? -400 : height + 400,
              tx: x,
              ty: y,
              c: `rgba(${data[i]},${data[i + 1]},${data[i + 2]},0.85)`,
              s: Math.random() * 2 + 1,
            });
          }
        }
      }

      const animate = () => {
        ctx.fillStyle = "rgba(2,6,23,0.35)";
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 55) {
            p.x -= dx * 0.02;
            p.y -= dy * 0.02;
          }
          p.x += (p.tx - p.x) * 0.06;
          p.y += (p.ty - p.y) * 0.06;
          ctx.fillStyle = p.c;
          ctx.fillRect(p.x, p.y, p.s, p.s);
        });

        requestAnimationFrame(animate);
      };
      animate();
    };

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen text-slate-300">
      {/* HERO */}
      <section className="pt-28 pb-20 flex justify-center border-b border-slate-800">
        <canvas
          ref={canvasRef}
          className="max-w-full drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]"
        />
      </section>

      {/* MAIN GRID */}
      <main className="max-w-7xl mx-auto px-5 py-14 grid grid-cols-1 lg:grid-cols-12 gap-14">
        
        {/* MOBILE START WRITING */}
        <div className="lg:hidden mb-10">
          <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl">
            <h3 className="text-cyan-400 font-black text-xs uppercase tracking-widest mb-3">
              Start Writing
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              Share your cybersecurity knowledge with CSC NITJ.
            </p>
            <button
              onClick={() => navigate("/create-blog")}
             className="w-full py-3 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-lg"
            >
             Start Writing
            </button>

          </div>
        </div>

        {/* BLOG LIST */}
        <div className="lg:col-span-8">
          {loading ? (
            <p className="text-slate-500">Loading blogs...</p>
          ) : (
            blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
          )}
        </div>

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-32 h-fit">
          <div className="bg-cyan-500/5 border border-cyan-500/20 p-8 rounded-2xl">
            <h3 className="text-cyan-400 font-black text-xs uppercase tracking-widest mb-4">
              Start Writing
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Share your cybersecurity knowledge with CSC NITJ.
            </p>
            <button
             onClick={() => navigate("/create-blog")}
             className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-lg"
            >
             Start Writing
            </button>

          </div>
        </aside>
      </main>
    </div>
  );
}