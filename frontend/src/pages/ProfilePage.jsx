import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // backend se aane wala user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 130 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 0.7 + 0.3,
      value: Math.random() > 0.5 ? "0" : "1",
      size: Math.random() * 6 + 10,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = `rgba(0, 209, 255, ${p.opacity})`;
        ctx.fillText(p.value, p.x, p.y);
        p.y += p.speed;
        if (p.y > canvas.height) p.y = 0;
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Server response invalid");
        }

        if (!res.ok) {
          throw new Error(data.message || "Profile fetch failed");
        }

        setUser({
          name: data.name,
          email: data.email,
          role: data.role,
          joinedAt: new Date(data.createdAt).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          }),
          blogs: data.blogsCount || 0,
          likes: data.likesCount || 0,
        });

      } catch (err) {
        console.error("Profile error:", err.message);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 text-xs tracking-widest">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">

      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* PAGE TITLE */}
          <div>
            <h1 className="text-5xl font-black tracking-tight">
              Cyber <span className="text-cyan-400">Identity</span>
            </h1>
            <p className="text-gray-400 mt-3 max-w-lg">
              Your presence & contribution inside CSC NITJ
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* LEFT — IDENTITY RAIL */}
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 flex flex-col gap-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-3xl font-black text-cyan-400">
                    {user.name?.[0]}
                  </div>
                  <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulse" />
                </div>

                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1 rounded-full text-xs uppercase tracking-widest border border-cyan-400 text-cyan-400">
                  {user.role}
                </span>
                <span className="px-4 py-1 rounded-full text-xs uppercase tracking-widest border border-red-400 text-red-400">
                  CSC NITJ
                </span>
              </div>

              <div className="text-sm text-gray-400">
                Member Since{" "}
                <span className="text-white font-semibold">
                  {user.joinedAt}
                </span>
              </div>
            </div>

            {/* RIGHT — STATS + ACTIONS */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">

              <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Blogs Written
                </p>
                <p className="text-4xl font-black text-cyan-400 mt-4">
                  {user.blogs}
                </p>
              </div>

              <div className="bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-xl p-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Total Likes
                </p>
                <p className="text-4xl font-black text-blue-400 mt-4">
                  {user.likes}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-6 py-3 rounded-lg bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.25em] hover:bg-cyan-400 transition">
                  Edit Profile
                </button>

                <button className="px-6 py-3 rounded-lg border border-blue-400 text-blue-400 font-black uppercase text-xs tracking-[0.25em] hover:bg-blue-400 hover:text-black transition">
                  My Blogs
                </button>

                <button
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-lg border border-red-500 text-red-500 font-black uppercase text-xs tracking-[0.25em] hover:bg-red-500 hover:text-black transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 tracking-wide">
            🛡️ Awareness is the first line of cyber defense • CSC NITJ
          </p>
        </div>
      </div>
    </div>
  );
}
