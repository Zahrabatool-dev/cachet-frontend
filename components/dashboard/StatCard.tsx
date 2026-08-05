"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { type LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string; // e.g. "%" ya "GB"
  accentColor?: "default" | "warning" | "danger";
  delay?: number;
};

const colorMap = {
  default: "rgb(var(--color-accent))",
  warning: "#f59e0b",
  danger: "#dc2626",
};

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.4,
      ease: [0.19, 1, 0.22, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, motionValue]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  accentColor = "default",
  delay = 0,
}: StatCardProps) {
  const color = colorMap[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.19, 1, 0.22, 1] }}
      className="group vault-panel p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-[rgb(var(--color-accent))]/40"
    >
     <div
  className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-transform duration-300 group-hover:scale-110"
  style={{ background: `${color}1A` }}
>
  <Icon size={20} style={{ color }} strokeWidth={1.75} />
</div>

      <p className="mt-4 text-2xl font-display font-medium text-[rgb(var(--color-text))]">
        <CountUp value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">{label}</p>
    </motion.div>
  );
}