import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ isLoggedIn }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // active link highlight (subtle, no design change)
  const isActive = (path) =>
    location.pathname === path
      ? "text-white"
      : "text-slate-400 hover:text-white";

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur border-b border-slate-800 px-6 py-4">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-white font-black text-xl italic"
          onClick={() => setOpen(false)}
        >
          CSC<span className="text-cyan-400">NITJ</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/about" className={isActive("/about")}>About</Link>
          <Link to="/team" className={isActive("/team")}>Team</Link>
          <Link to="/blog" className={isActive("/blog")}>Blog</Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="px-4 py-2 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500 hover:text-black transition"
            >
              Sign In
            </Link>
          ) : (
            <Link
              to="/profile"
              className="w-9 h-9 rounded-full border border-cyan-500 flex items-center justify-center text-cyan-400"
            >
              👤
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-cyan-400 text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-6 flex flex-col gap-6 text-xs font-bold uppercase tracking-widest">
          <Link to="/" onClick={() => setOpen(false)} className={isActive("/")}>
            Home
          </Link>
          <Link to="/about" onClick={() => setOpen(false)} className={isActive("/about")}>
            About
          </Link>
          <Link to="/team" onClick={() => setOpen(false)} className={isActive("/team")}>
            Team
          </Link>
          <Link to="/blog" onClick={() => setOpen(false)} className={isActive("/blog")}>
            Blog
          </Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="inline-block w-fit px-4 py-2 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-500 hover:text-black transition"
            >
              Sign In
            </Link>
          ) : (
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-full border border-cyan-500 flex items-center justify-center text-cyan-400"
            >
              👤
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
