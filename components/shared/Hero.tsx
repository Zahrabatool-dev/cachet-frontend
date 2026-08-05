"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.19, 1, 0.22, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative isolate pt-32 sm:pt-40 pb-12 px-6 overflow-hidden">

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* Eyebrow badge */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <div className="vault-panel-static inline-flex items-center gap-2 px-4 py-1.5 rounded-full">
            <span className="badge-dot" />
            <span className="font-mono text-[11px] sm:text-xs tracking-widest uppercase text-[rgb(var(--color-text-muted))]">
              Encrypted &middot; Verified &middot; Yours
            </span>
          </div>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.12] tracking-tight text-[rgb(var(--color-text))]"
        >
          Your documents
          <br />
          <span className="text-[rgb(var(--color-accent))]">Locked.</span> Verified.{" "}
          <span className="text-[rgb(var(--color-accent))]">Yours.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 text-base sm:text-lg text-[rgb(var(--color-text-muted))] max-w-xl mx-auto leading-relaxed"
        >
          Upload your files to a secure vault, lock them, and share them
          anytime using a verified link, where every file comes with proof
          of authenticity.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href="/signup"
            className="btn-shimmer w-full sm:w-auto text-center text-sm font-medium px-6 py-3 rounded-md bg-[rgb(var(--color-accent))] text-white shadow-[0_0_24px_rgba(124,58,237,0.3)] transition-all duration-200 hover:shadow-[0_0_32px_rgba(124,58,237,0.45)] hover:brightness-110 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-accent))]/50 focus-visible:ring-offset-2"
          >
            Get Started
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto text-center text-sm font-medium px-6 py-3 rounded-md border border-[rgb(var(--color-accent))]/25 text-[rgb(var(--color-text))] transition-all duration-200 hover:border-[rgb(var(--color-accent))]/60 hover:bg-[rgb(var(--color-accent))]/5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-accent))]/50 focus-visible:ring-offset-2"
          >
            See how it works
          </a>
        </motion.div>

        {/* Trust line — honest for a launch-stage product, no fake avatars/numbers */}
        <motion.p
          variants={item}
          className="mt-8 text-[11px] sm:text-xs text-[rgb(var(--color-text-muted))] font-mono tracking-wide"
        >
          Built with bank-grade encryption standards
        </motion.p>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="group absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent))] transition-colors duration-200 focus-visible:outline-none focus-visible:text-[rgb(var(--color-accent))]"
        aria-label="Scroll to features"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} strokeWidth={1.75} />
        </motion.span>
      </motion.a>
    </section>
  );
}