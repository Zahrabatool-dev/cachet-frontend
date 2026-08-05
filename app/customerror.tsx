"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[rgb(var(--color-bg))] relative overflow-hidden">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="text-center max-w-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6"
        >
          <AlertTriangle size={32} className="text-red-500" strokeWidth={1.5} />
        </motion.div>

        <h1 className="font-display text-xl font-medium text-[rgb(var(--color-text))]">
          Something broke the seal
        </h1>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
          An unexpected error occurred. Try again, or head back if it keeps happening.
        </p>

        <button
          onClick={reset}
          className="btn-shimmer mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium hover:brightness-110 transition-all"
        >
          <RotateCcw size={16} /> Try again
        </button>
      </motion.div>
    </div>
  );
}
