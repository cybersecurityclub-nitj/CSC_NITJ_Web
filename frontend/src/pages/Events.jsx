import React, { useEffect, useState, useRef } from "react";

/* Animated neural-network background */
const NeuralNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

      particles.forEach((p1, i) => {
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
      });

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
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

const Events = () => {
  const [visible, setVisible] = useState(false);
  const [events, setEvents] = useState([]);

  // Fetch public events list
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/events`
        );

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();

        // Supports both array and wrapped response formats
        const eventsArray = Array.isArray(data)
          ? data
          : data.events || [];

        const formatted = eventsArray.map((e) => ({
          id: e._id,
          title: e.title,
          desc: e.description,
          date: new Date(e.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          mode: e.mode,
          tag: e.tag,
        }));

        setEvents(formatted);
        setTimeout(() => setVisible(true), 200);
      } catch (err) {
        console.error("Fetch Events Error:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-[#010714] text-white min-h-screen relative overflow-x-hidden">
      <NeuralNetwork />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Page header */}
        <div
          className={`text-center mb-20 transition-all ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Our <span className="text-cyan-400">Events</span>
          </h1>
          <p className="text-gray-400 mt-4 text-sm tracking-widest uppercase">
            Workshops • CTFs • Expert Sessions
          </p>
        </div>

        {/* Events grid */}
        {events.length === 0 ? (
          <div className="text-center text-gray-400 font-mono tracking-widest">
            No upcoming events
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {events.map((evt, i) => (
              <div
                key={evt.id}
                className={`group relative transition-all duration-700 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent rounded-3xl blur opacity-30 group-hover:opacity-60 transition" />

                <div className="relative bg-[#0a1628]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-cyan-500/30 hover:-translate-y-2 transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400">
                      EVT_{i + 1}
                    </span>
                    <span className="text-[10px] px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/5">
                      {evt.mode}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition">
                    {evt.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {evt.desc}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500 font-mono">
                      {evt.date}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                      {evt.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
