import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/*
  Canvas-based neural background.
  Runs independently and stays fixed behind all UI.
*/
const NeuralNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#22d3ee";
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const count = Math.floor(
        (canvas.width * canvas.height) / 18000
      );

      for (let i = 0; i < count; i++) {
        particles.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          )
        );
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();

        ctx.shadowBlur = 15;
        ctx.shadowColor = "#22d3ee";
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34,211,238,${
              0.7 * (1 - dist / 220)
            })`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalCompositeOperation = "source-over";
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

/*
  Individual admin module card.
  Navigation is allowed only when the module is active.
*/
const AdminModule = ({ id, title, desc, active, prefix, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (active && link) navigate(link);
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative transition-all transform ${
        active
          ? "opacity-100 translate-y-0 scale-100 duration-700 cursor-pointer"
          : "opacity-0 translate-y-8 scale-95 duration-300 cursor-not-allowed"
      }`}
    >
      <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-500/40 to-transparent rounded-[2.5rem] opacity-30 group-hover:opacity-100 transition-all duration-500 blur-[2px]" />

      <div className="relative h-full bg-[#0a1628]/90 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <div
            className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"
            style={{ width: active ? "100%" : "0%" }}
          />
        </div>

        <div className="flex justify-between items-center mb-8 mt-2">
          <span className="font-mono text-[10px] text-cyan-500/80 tracking-[3px] bg-cyan-500/5 px-3 py-1 rounded-md border border-cyan-500/20">
            {prefix}_{id}
          </span>

          <div
            className={`w-2 h-2 rounded-full shadow-[0_0_10px_#22d3ee] ${
              active ? "bg-cyan-400 animate-pulse" : "bg-gray-600"
            }`}
          />
        </div>

        <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight group-hover:text-cyan-400">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          {desc}
        </p>

        <div
          className={`mt-auto pt-6 border-t border-white/5 flex items-center gap-2
            text-[10px] font-bold uppercase tracking-widest ${
              active
                ? "text-cyan-500/70 group-hover:text-cyan-400"
                : "text-gray-600"
            }`}
        >
          <div className="h-[1px] w-8 bg-current opacity-30 group-hover:w-12 transition-all" />
          {active ? "Access Module" : "Locked"}
        </div>
      </div>
    </div>
  );
};

/*
  Admin landing page.
  Modules reveal sequentially for a controlled visual flow.
*/
const AdminPage = () => {
  const [visible, setVisible] = useState([false, false, false]);

  useEffect(() => {
    setTimeout(() => setVisible([true, false, false]), 300);
    setTimeout(() => setVisible([true, true, false]), 600);
    setTimeout(() => setVisible([true, true, true]), 900);
  }, []);

  return (
    <div className="bg-[#010714] text-white min-h-screen relative overflow-x-hidden">
      <NeuralNetwork />

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-24 px-6 flex justify-center">
        <div className="max-w-4xl w-full bg-[#0a1628]/70 backdrop-blur-3xl border border-white/10 p-16 rounded-[3rem] text-center shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Admin <span className="text-cyan-400">Control Panel</span>
          </h1>

          <p className="text-gray-300 text-lg mt-8 italic">
            Authorized system interface for governance, moderation,
            and operational control.
          </p>
        </div>
      </section>

      {/* Admin Modules */}
      <section className="relative z-10 px-6 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-center max-w-4xl mx-auto">
          <AdminModule
            active={visible[0]}
            id="001"
            prefix="EVT"
            title="Event Control"
            desc="Create, modify, or retire official CSC events and workshops."
            link="/admin/events"
          />

          <AdminModule
            active={visible[1]}
            id="002"
            prefix="MOD"
            title="Blog Moderation"
            desc="Approve, reject, and review submitted blogs before publication."
            link="/admin/blogs"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
