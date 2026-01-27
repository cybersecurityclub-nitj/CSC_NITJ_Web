import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/clublogo.png";
import {
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // New X icon import

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Helper to ensure page starts at top on navigation
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Thin neon line on top */}
      <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-[#00D1FF] to-transparent shadow-[0_0_20px_#00D1FF]" />

      <footer className="relative bg-[#020617] text-white pt-16 pb-10 px-6 md:px-12 overflow-hidden">

        {/* Subtle background glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-12 lg:gap-14 mb-16">

            {/* 1. Brand Info */}
            <div className="flex flex-col gap-5">
              <img
                src={logo}
                alt="CSC NITJ Logo"
                className="w-40 object-contain drop-shadow-[0_0_15px_rgba(0,209,255,0.3)]"
              />
              <h2 className="text-2xl font-extrabold tracking-tight">
                CSC <span className="text-[#00D1FF]">NITJ</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Cyber Security Club of NIT Jalandhar — building ethical hackers and secure developers.
              </p>
            </div>

            {/* 2. Link Grid Container */}
            <div className="grid grid-cols-2 lg:contents gap-y-12 gap-x-4">

              {/* Quick Links Section */}
              <div className="col-span-1">
                <h3 className="text-sm font-bold mb-6 tracking-widest uppercase text-gray-200 border-b border-slate-800 pb-2 inline-block">
                  Quick Links
                </h3>
                <ul className="flex flex-col gap-4 text-gray-400 text-sm">
                  {["Home", "About", "Team", "Blog"].map((item) => (
                    <li key={item}>
                      <Link
                        to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        className="group relative inline-block"
                        onClick={handleScrollToTop}
                      >
                        <span className="group-hover:text-[#00D1FF] transition-colors">{item}</span>
                        <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#00D1FF] transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explore Section */}
              <div className="col-span-1">
                <h3 className="text-sm font-bold mb-6 tracking-widest uppercase text-gray-200 border-b border-slate-800 pb-2 inline-block">
                  Explore
                </h3>
                <ul className="flex flex-col gap-4 text-gray-400 text-sm">
                  {["Events", "Projects", "Workshops", "Contact"].map((item) => {
                    // Logic: If it's Events or Workshops, point to the #events ID on the about page
                    // Otherwise, point to its own page
                    const destination = (item === "Events" || item === "Workshops")
                      ? "/about#events"
                      : `/${item.toLowerCase()}`;

                    return (
                      <li key={item}>
                        <Link
                          to={destination}
                          className="group relative inline-block"
                          // We don't use scrollToTop for these because we WANT it to scroll to the #id
                          onClick={item !== "Events" && item !== "Workshops" ? handleScrollToTop : undefined}
                        >
                          <span className="group-hover:text-[#00D1FF] transition-colors">{item}</span>
                          <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#00D1FF] transition-all duration-300 group-hover:w-full" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Connect Section */}
              <div className="col-span-2 lg:col-span-1">
                <h3 className="text-sm font-bold mb-6 tracking-widest uppercase text-gray-200 border-b border-slate-800 pb-2 inline-block">
                  Connect
                </h3>
                <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4">
                  <a href="https://www.instagram.com/csc_nitj/" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-gray-400 hover:text-[#00D1FF] transition-colors text-sm">
                    <FaInstagram className="text-lg" /> <span>Instagram</span>
                  </a>
                  <a href="https://linkedin.com/company/cyber-security-club-nitj/" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-gray-400 hover:text-[#00D1FF] transition-colors text-sm">
                    <FaLinkedinIn className="text-lg" /> <span>LinkedIn</span>
                  </a>
                  <a href="https://github.com/cybersecurityclub-nitj" target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-gray-400 hover:text-[#00D1FF] transition-colors text-sm">
                    <FaGithub className="text-lg" /> <span>GitHub</span>
                  </a>
                  <a href="#" className="group flex items-center gap-3 text-gray-400 hover:text-[#00D1FF] transition-colors text-sm">
                    <FaXTwitter className="text-lg" /> <span>X</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom copyright */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">
              © {currentYear} CSC NITJ • Built with ⚡ by the Cyber Team
            </p>
            <p className="text-[#00D1FF]/40 text-[9px] uppercase tracking-[0.3em] font-bold">
              // SECURING_THE_FUTURE
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;