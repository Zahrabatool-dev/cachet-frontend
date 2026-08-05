"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="w-11 h-6 rounded-full bg-neutral-200" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{
        position: "relative",
        width: "44px",
        height: "24px",
        borderRadius: "9999px",
        flexShrink: 0,
        backgroundColor: isDark ? "rgb(74, 158, 128)" : "#d4d4d4",
        transition: "background-color 0.25s",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <motion.span
        animate={{ x: isDark ? 22 : 2 }}
        transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        style={{
          position: "absolute",
          top: "2px",
          width: "20px",
          height: "20px",
          borderRadius: "9999px",
          backgroundColor: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={11} className="text-[rgb(31,77,61)]" fill="currentColor" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={11} className="text-amber-500" fill="currentColor" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}