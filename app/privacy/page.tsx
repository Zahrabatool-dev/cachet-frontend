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
      staggerChildren: 0.12,
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

export default function PrivacyPage() {
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
          Privacy Policy
        </motion.h1>
        <motion.p variants={item} className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
          Last updated: August 2026
        </motion.p>

        <div className="mt-10 space-y-8 text-sm text-[rgb(var(--color-text))] leading-relaxed">
          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">1. What we collect</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              When you create an account, we collect your name, email address, and a securely
              hashed version of your password. When you upload a document, we store the file
              itself, along with metadata you provide, such as category, tags, and expiry date.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">2. How we use it</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              Your data is used solely to operate your Cachet vault: authenticating you,
              storing and retrieving your documents, sending expiry reminders, and generating
              share links you create. We do not sell, rent, or share your personal data with
              third parties for marketing purposes.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">3. Document storage & encryption</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              Documents are encrypted at rest. Only your authenticated account can access your
              documents by default. Documents are only made accessible to others when you
              explicitly generate a share link, which you control and can revoke at any time.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">4. Share links</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              Share links are time-limited and, optionally, password-protected. Anyone with a
              valid, unexpired link and the password, if one is set - can view the associated
              document. Links automatically stop working after their expiry time or once
              revoked.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">5. Data retention & deletion</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              You may delete any document at any time, which permanently removes it from
              storage. If you close your account, your data is deleted in accordance with
              applicable retention requirements.
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">6. Your rights</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              You can access, update, or delete your personal information and documents at any
              time through your account settings. For any privacy-related questions, contact us
              at{" "}
              <a href="mailto:privacy@cachet.app" className="text-[rgb(var(--color-accent))] hover:underline">
                privacy@cachet.app
              </a>
              .
            </p>
          </motion.section>

          <motion.section variants={item}>
            <h2 className="font-display text-lg font-medium mb-3">7. Changes to this policy</h2>
            <p className="text-[rgb(var(--color-text-muted))]">
              We may update this policy from time to time. Material changes will be communicated
              through the app or by email where appropriate.
            </p>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}