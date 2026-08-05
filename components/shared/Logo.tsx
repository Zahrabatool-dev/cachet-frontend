"use client";

import { motion } from "framer-motion";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light"; // "light" = for dark backgrounds (CTA, Footer)
  showText?: boolean;
  animated?: boolean; // set false to disable hover dial-spin (e.g. in footer where it's not a link)
};

const sizeMap = {
  sm: { box: "w-6 h-6", svg: 20, text: "text-base" },
  md: { box: "w-8 h-8", svg: 26, text: "text-lg" },
  lg: { box: "w-10 h-10", svg: 32, text: "text-xl" },
};

export function Logo({
  className = "",
  size = "md",
  variant = "default",
  showText = true,
  animated = true,
}: LogoProps) {
  const { box, svg, text } = sizeMap[size];

  // resolve colors based on variant — default reads from theme tokens,
  // light forces white for dark surfaces like CTA/Footer
  const strokeColor = variant === "light" ? "white" : "rgb(var(--color-accent))";
  const textColor =
    variant === "light" ? "text-white" : "text-[rgb(var(--color-text))]";
  const glowColor =
    variant === "light" ? "bg-white/10" : "bg-[rgb(var(--color-accent))]/12";

  return (
    <div className={`group flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center ${box}`}>
        {animated && (
          <span
            className={`absolute inset-0 rounded-full opacity-0 ${glowColor} group-hover:opacity-100 blur-md transition-opacity duration-500`}
            aria-hidden="true"
          />
        )}

        <svg
          width={svg}
          height={svg}
          viewBox="0 0 24 24"
          fill="none"
          className="relative drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]"
          role="img"
          aria-label="Cachet"
        >
          {/* shackle */}
          <path
            d="M8 10V7a4 4 0 0 1 8 0v3"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* vault body */}
          <rect x="4" y="10" width="16" height="10" rx="1.5" stroke={strokeColor} strokeWidth="1.5" />

          {/* dial ticks — rotate together as one group on hover */}
          <motion.g
            style={{ originX: "12px", originY: "15px" }}
            className={
              animated
                ? "transition-transform duration-700 ease-out group-hover:[transform:rotate(90deg)]"
                : ""
            }
          >
            <circle cx="12" cy="15" r="2.75" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
            <path d="M12 12.25V13" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" />
            <path d="M12 17V17.75" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" />
            <path d="M9.25 15H10" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" />
            <path d="M14 15H14.75" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" />
          </motion.g>

          {/* center pin */}
          <circle cx="12" cy="15" r="1.1" fill={strokeColor} />
        </svg>
      </div>

      {showText && (
        <span
          className={`font-display tracking-wide ${text} ${textColor} transition-[letter-spacing] duration-500 group-hover:tracking-wider`}
        >
          Cachet
        </span>
      )}
    </div>
  );
}