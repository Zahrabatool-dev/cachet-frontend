"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { PageBackground } from "@/components/shared/PageBackground";

type AuthLayoutProps = {
  children: React.ReactNode;
  heading: string;
  subheading: string;
};

export function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding panel, dark, same recipe as CTA/Footer */}
      <div className="relative hidden lg:flex flex-col justify-between bg-neutral-950 px-12 py-10 overflow-hidden">
        {/* dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ghost lock watermark */}
        <Lock
          size={480}
          strokeWidth={0.5}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.035] pointer-events-none select-none"
        />

        {/* centered accent glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.15] blur-[140px] pointer-events-none"
          style={{ background: "rgb(var(--color-accent))" }}
        />

        <Link href="/" className="relative z-10">
          <Logo variant="light" />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="relative z-10 max-w-md"
        >
          <h2 className="font-display text-3xl font-medium text-white leading-tight">
            Every document deserves proof it's real.
          </h2>
          <p className="mt-4 text-neutral-400">
            Cachet seals every file you upload with verified, tamper-evident
            protection. So you always know it's exactly what it claims to be.
          </p>
        </motion.div>

        <p className="relative z-10 text-xs text-neutral-500 font-mono">
          Encrypted at rest, always.
        </p>
      </div>

      {/* Right — form panel, exact same background system as the landing page */}
      <div className="relative flex items-center justify-center px-6 py-12 overflow-hidden">
        <PageBackground />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="vault-panel relative z-10 w-full max-w-sm p-8"
        >
          <Link href="/" className="lg:hidden flex justify-center mb-8">
            <Logo />
          </Link>

          <div className="text-center lg:text-left mb-8">
            <h1 className="font-display text-2xl font-medium text-[rgb(var(--color-text))]">
              {heading}
            </h1>
            <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
              {subheading}
            </p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}