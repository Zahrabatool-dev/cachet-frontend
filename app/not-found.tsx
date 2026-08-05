"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[rgb(var(--color-bg))] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, rgb(var(--color-accent) / 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="relative text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-[rgb(var(--color-accent))]/10 mb-6"
        >
          <Lock size={32} className="text-[rgb(var(--color-accent))]" strokeWidth={1.5} />
        </motion.div>

        <h1 className="font-display text-6xl font-medium text-[rgb(var(--color-text))]">404</h1>
        <h2 className="mt-3 font-display text-xl font-medium text-[rgb(var(--color-text))]">
          This vault is empty
        </h2>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))] max-w-sm mx-auto">
          The page you're looking for doesn't exist, or you don't have the key to unlock it.
        </p>

        <Link
          href="/"
          className="btn-shimmer mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium hover:brightness-110 transition-all"
        >
          <ArrowLeft size={16} /> Back to safety
        </Link>
      </motion.div>
    </div>
  );
}