"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 10000, suffix: "+", label: "UMKM Data" },
  { value: 596, suffix: "", label: "Kecamatan" },
  { value: 27, suffix: "", label: "Kab/Kota" },
  { value: 3, suffix: "", label: "AI Models" },
];

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      className="text-3xl sm:text-4xl font-bold gradient-text"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {isInView ? `${value.toLocaleString("id-ID")}${suffix}` : "0"}
    </motion.span>
  );
}

export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient-bg opacity-90" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="particle-1 absolute top-[20%] left-[10%] w-3 h-3 rounded-full bg-accent/40" />
        <div className="particle-2 absolute top-[60%] left-[80%] w-4 h-4 rounded-full bg-primary-300/30" />
        <div className="particle-3 absolute top-[40%] left-[30%] w-2 h-2 rounded-full bg-accent/50" />
        <div className="particle-4 absolute top-[70%] left-[60%] w-5 h-5 rounded-full bg-primary-200/20" />
        <div className="particle-5 absolute top-[30%] left-[70%] w-2.5 h-2.5 rounded-full bg-accent/30" />
        <div className="particle-6 absolute top-[80%] left-[20%] w-3.5 h-3.5 rounded-full bg-primary-300/25" />
        <div className="particle-7 absolute top-[15%] left-[50%] w-2 h-2 rounded-full bg-accent/45" />
        <div className="particle-8 absolute top-[50%] left-[90%] w-3 h-3 rounded-full bg-primary-200/35" />
      </div>

      {/* Content */}
      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Platform Intelijen UMKM{" "}
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              Terdepan
            </span>{" "}
            di Indonesia
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 mb-10 max-w-3xl mx-auto"
        >
          AI-Powered Location Intelligence & Credit Risk Assessment
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="#harga"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-accent-600 text-white font-semibold text-lg hover:shadow-xl hover:shadow-accent/30 transition-all hover:scale-105"
          >
            Coba Demo Gratis
          </a>
          <a
            href="#fitur"
            className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all hover:scale-105"
          >
            Pelajari Lebih Lanjut
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 sm:p-6">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
