"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { PageBackground } from "@/components/shared/PageBackground";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function TermsPage() {
  return (
    <div className="relative isolate min-h-screen bg-[rgb(var(--color-bg))] px-6 py-16">
      <PageBackground />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-2xl mx-auto"
      >
        <motion.div variants={item} className="flex items-center justify-between mb-10">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>

          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text))] px-4 py-2 rounded-lg border border-[rgb(var(--color-accent))]/20 hover:border-[rgb(var(--color-accent))]/50 hover:bg-[rgb(var(--color-accent))]/6 transition-all duration-200"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back to home
          </Link>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-3xl font-medium text-[rgb(var(--color-text))]"
        >
          Terms of Service
        </motion.h1>
        <motion.p variants={item} className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
          Last updated: August 2026
        </motion.p>

        <div className="mt-10 space-y-8 text-sm text-[rgb(var(--color-text))] leading-relaxed">
          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">1. Acceptance of terms</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              By creating an account or using Cachet, you agree to these Terms of Service. If
              you do not agree, please do not use the service.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">2. Your account</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              You are responsible for maintaining the confidentiality of your account
              credentials and for all activity that occurs under your account. Notify us
              immediately if you suspect unauthorized access.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">3. Acceptable use</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              You agree not to upload content that is illegal, infringes on others' rights, or
              violates any applicable law. You are solely responsible for the documents you
              upload and share.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">4. Share links</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              You are responsible for who you share links with and any password you set. Cachet
              is not liable for access granted through links you create and distribute.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">5. Storage limits</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              Each account is subject to a storage quota as shown in your dashboard. We reserve
              the right to adjust limits with reasonable notice.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">6. Termination</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              You may stop using Cachet and delete your account at any time. We may suspend or
              terminate accounts that violate these terms.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">7. Disclaimer</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              Cachet is provided "as is" without warranties of any kind. While we take security
              seriously, no system is completely immune to risk, and you use the service at your
              own discretion.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">8. Changes</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              We may update these terms from time to time. Continued use of Cachet after changes
              constitutes acceptance of the updated terms.
            </p>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}