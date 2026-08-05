"use client";

import { motion } from "framer-motion";

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–4
}

const labels = ["", "Weak", "Fair", "Good", "Strong"];
const colors = ["", "#dc2626", "#f59e0b", "#65a30d", "rgb(var(--color-accent))"];

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const strength = getStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-neutral-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: colors[strength] }}
              initial={{ width: "0%" }}
              animate={{ width: i <= strength ? "100%" : "0%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>
      {strength > 0 && (
        <p className="mt-1.5 text-xs text-[rgb(var(--color-text-muted))]">
          {labels[strength]}
        </p>
      )}
    </div>
  );
}