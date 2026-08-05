"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 1.4, ease: [0.19, 1, 0.22, 1] } },
};

export function CTA() {
  return (
    <section className="relative pt-28 pb-20 px-6 overflow-hidden bg-neutral-950">
      <div
        className="absolute inset-0 opacity-[0.09] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <Lock
        size={480}
        strokeWidth={0.5}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] text-white/[0.05] pointer-events-none select-none z-0"
      />

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.18] blur-[140px] pointer-events-none z-0"
        style={{ background: "rgb(var(--color-accent))" }}
      />
      <div className="absolute right-[10%] bottom-0 w-[300px] h-[300px] rounded-full opacity-[0.13] blur-[90px] pointer-events-none bg-white z-0" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        <motion.div variants={item} className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center w-16 h-16">
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-white"
            />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/25">
              <Lock size={22} strokeWidth={1.75} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.span variants={item} className="font-mono text-xs tracking-widest uppercase text-[rgb(var(--color-accent))]">
          Get started
        </motion.span>

        <motion.h2 variants={item} className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-[1.15]">
          Your documents deserve
          <br />a real vault, not a folder.
        </motion.h2>

        <motion.p variants={item} className="mt-5 text-neutral-400 max-w-md mx-auto">
          Set up in under two minutes. No card required to start. Just you,
          your documents, and a lock only you hold the key to.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white text-neutral-950 font-medium text-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_-5px_rgba(255,255,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Create your vault
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="#how-it-works"
            className="px-7 py-3.5 rounded-lg border border-neutral-700 text-neutral-300 font-medium text-sm transition-colors duration-300 hover:border-neutral-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            See how it works
          </Link>
        </motion.div>

        <motion.p variants={item} className="mt-6 text-xs text-neutral-500 font-mono tracking-wide">
          Encrypted at rest · Free to start · Cancel anytime
        </motion.p>
      </motion.div>
    </section>
  );
}