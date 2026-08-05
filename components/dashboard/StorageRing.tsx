"use client";

import { motion } from "framer-motion";

export function StorageRing({
  usedMB,
  totalMB,
}: {
  usedMB: number;
  totalMB: number;
}) {
  const rawPercent = (usedMB / totalMB) * 100;
  const percent = Math.min(Math.round(rawPercent), 100);
  const displayPercent = usedMB > 0 && percent === 0 ? "<1" : percent;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const color =
    percent > 85 ? "#dc2626" : percent > 60 ? "#f59e0b" : "rgb(var(--color-accent))";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
      className="vault-panel p-5 flex items-center gap-5"
    >
      <div className="relative w-24 h-24 shrink-0">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="rgb(var(--color-accent) / 0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-display font-medium text-[rgb(var(--color-text))]">
            {percent}%
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[rgb(var(--color-text))]">Storage used</p>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
          {usedMB}MB of {(totalMB / 1024).toFixed(0)}GB
        </p>
      </div>
    </motion.div>
  );
}