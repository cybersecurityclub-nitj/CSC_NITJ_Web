import React from "react";
import logo from "../assets/clublogo.png";
import {
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";


const Footer = () => {
  return (
    <>
      {/* Thin neon line on top */}
      <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-[#00D1FF] to-transparent shadow-[0_0_20px_#00D1FF]" />

      <footer className="relative bg-[#020617] text-white pt-20 pb-10 px-6 md:px-12 overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-20">

            {/* Brand info */}
            <div className="flex flex-col gap-5">
              <img
                src={logo}
                alt="CSC NITJ Logo"
                className="w-44 object-contain drop-shadow-[0_0_20px_rgba(0,209,255,0.25)]"
              />
              <h2 className="text-2xl font-extrabold tracking-tight">
                CSC <span className="text-[#00D1FF]">NITJ</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Cyber Security Club of NIT Jalandhar — building ethical hackers,
                secure developers, and cyber awareness leaders.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-lg font-bold mb-6 tracking-wide text-gray-200">
                Quick Links
              </h3>
              <ul className="flex flex-col gap-4 text-gray-400 text-sm">
                {["Home", "About", "Team", "Blog"].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="group relative">
                      <span className="group-hover:text-[#00D1FF] transition-colors">
                        {item}
                      </span>
                      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#00D1FF] transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore section */}
            <div>
              <h3 className="text-lg font-bold mb-6 tracking-wide text-gray-200">
                Explore
              </h3>
              <ul className="flex flex-col gap-4 text-gray-400 text-sm">
                {["Events", "Projects", "Workshops", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="group relative">
                      <span className="group-hover:text-[#00D1FF] transition-colors">
                        {item}
                      </span>
                      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#00D1FF] transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social links */}
            <div>
              <h3 className="text-lg font-bold mb-6 tracking-wide text-gray-200">
                Connect
              </h3>

              <ul className="flex flex-col gap-5 text-gray-400 text-sm">
                <li>
                  <a href="#" className="group flex items-center gap-4 hover:text-[#00D1FF] transition-colors">
                    <FaInstagram className="text-lg opacity-80 group-hover:opacity-100" />
                    Instagram
                  </a>
                </li>

                <li>
                  <a href="#" className="group flex items-center gap-4 hover:text-[#00D1FF] transition-colors">
                    <FaLinkedinIn className="text-lg opacity-80 group-hover:opacity-100" />
                    LinkedIn
                  </a>
                </li>

                <li>
                  <a href="#" className="group flex items-center gap-4 hover:text-[#00D1FF] transition-colors">
                    <FaGithub className="text-lg opacity-80 group-hover:opacity-100" />
                    GitHub
                  </a>
                </li>

                <li>
                  <a href="#" className="group flex items-center gap-4 hover:text-[#00D1FF] transition-colors">
                    <FaTwitter className="text-lg opacity-80 group-hover:opacity-100" />
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="pt-8 border-t border-white/5 flex justify-center">
            <p className="text-gray-500 text-[11px] tracking-[0.15em] uppercase">
              © 2025 CSC NITJ • Built with ⚡ by the Cyber Team
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;