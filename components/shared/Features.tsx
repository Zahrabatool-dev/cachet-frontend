"use client";

import { motion, type Variants } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  BellRing,
  Link2,
  SearchCheck,
  Activity,
} from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, ease: [0.19, 1, 0.22, 1] },
  },
};

const features = [
  {
    icon: ShieldCheck,
    title: "Encrypted at rest",
    description:
      "Every document is encrypted the moment it's uploaded. Only you hold the key to unlock it.",
  },
  {
    icon: KeyRound,
    title: "Two-factor verification",
    description:
      "Email or SMS OTP adds a second lock on your account, beyond just your password.",
  },
  {
    icon: BellRing,
    title: "Expiry reminders",
    description:
      "Set an expiry date on any document and get notified automatically before it lapses.",
  },
  {
    icon: Link2,
    title: "Secure sharing links",
    description:
      "Share a document via a time-limited link, with an optional password. Access ends when the link expires.",
  },
  {
    icon: SearchCheck,
    title: "Search, tags & categories",
    description:
      "Find any document instantly by name, tag, or category - Identity, Education, Financial, Medical, Legal, and more.",
  },
  {
    icon: Activity,
    title: "Activity log & storage",
    description:
      "See every upload, view, download, and share on a timeline - plus a live storage usage tracker.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative pt-16 pb-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[rgb(var(--color-accent))]">
            Features
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-medium text-[rgb(var(--color-text))]">
            Everything a vault should do
          </h2>
          <p className="mt-4 text-[rgb(var(--color-text-muted))]">
            Built for the documents that actually matter  CNIC, degrees,
            insurance, licenses - with the security and structure they
            deserve.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={item}
              className="group relative vault-panel p-6 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-[rgb(var(--color-accent))]/40"
            >
              {/* soft accent wash that fades in on hover, sits behind the content */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[rgb(var(--color-accent))]/0 group-hover:bg-[rgb(var(--color-accent))]/[0.08] blur-2xl transition-colors duration-500" />

              <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[rgb(var(--color-accent))]/10 transition-all duration-300 group-hover:bg-[rgb(var(--color-accent))]/20 group-hover:shadow-[0_0_0_4px_rgb(var(--color-accent)_/_0.08)]">
                <Icon
                  size={20}
                  className="text-[rgb(var(--color-accent))] transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="relative mt-4 font-display text-lg font-medium text-[rgb(var(--color-text))]">
                {title}
              </h3>
              <p className="relative mt-2 text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}