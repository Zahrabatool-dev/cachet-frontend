"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Lock, ArrowUp } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
  },
};

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-neutral-950 px-6 pt-16 pb-8 overflow-hidden">
      {/* same dot grid as CTA, continues the surface instead of cutting it off */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between gap-12 pb-12 border-b border-neutral-900">
          <motion.div variants={item} className="max-w-xs">
            <div className="flex items-center gap-2">
              <Lock size={18} strokeWidth={1.75} className="text-white" />
              <span className="font-display text-lg font-medium text-white">
                Cachet
              </span>
            </div>
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
              A secure vault for the documents that actually matter.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-10">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <motion.div key={heading} variants={item}>
                <h4 className="font-mono text-xs tracking-widest uppercase text-neutral-500">
                  {heading}
                </h4>
                <ul className="mt-4 flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group relative inline-block text-sm text-neutral-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:text-white"
                      >
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
        >
          <p className="text-xs text-neutral-600 font-mono">
            © {new Date().getFullYear()} Cachet. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <p className="text-xs text-neutral-600 font-mono">
              Encrypted at rest, always.
            </p>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              aria-label="Back to top"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-800 text-neutral-500 transition-all duration-200 hover:border-neutral-600 hover:text-white hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <ArrowUp size={14} strokeWidth={1.75} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}