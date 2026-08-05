"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import {
  UserPlus,
  UploadCloud,
  FolderClock,
  Share2,
  ArrowRight,
  ArrowDown,
  type LucideIcon,
} from "lucide-react";

// same stagger pattern as Features.tsx
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

// arrow draws in, inherits hidden/show from parent container automatically
const arrow: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
  },
};

const arrowVertical: Variants = {
  hidden: { opacity: 0, scaleY: 0 },
  show: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
};

type Step = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "01",
    icon: UserPlus,
    title: "Sign up & verify",
    description:
      "Create an account and confirm it's really you with a one - time code. No extra apps, just email or SMS.",
  },
  {
    number: "02",
    icon: UploadCloud,
    title: "Upload your document",
    description:
      "Drop in a PDF or image, pick a category, and add a tag or two. It's encrypted the moment it lands.",
  },
  {
    number: "03",
    icon: FolderClock,
    title: "Organize & set reminders",
    description:
      "Set an expiry date on anything time-sensitive. A license, a policy and get notified before it lapses.",
  },
  {
    number: "04",
    icon: Share2,
    title: "Share securely, when needed",
    description:
      "Generate a time - limited link, add a password if you like, and access ends the moment it expires.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative pt-4 pb-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[rgb(var(--color-accent))]">
            How it works
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-medium text-[rgb(var(--color-text))]">
            From upload to peace of mind
          </h2>
          <p className="mt-4 text-[rgb(var(--color-text-muted))]">
            Four steps stand between a loose stack of documents and a vault
            you can actually rely on.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row md:items-stretch gap-0"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Fragment key={step.number}>
                <motion.div
                  variants={item}
                  className="group vault-panel p-6 flex-1 text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-[rgb(var(--color-accent))]/40"
                >
                  <div className="mx-auto inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[rgb(var(--color-accent))]/10 transition-colors duration-300 group-hover:bg-[rgb(var(--color-accent))]/20">
                    <Icon
                      size={20}
                      className="text-[rgb(var(--color-accent))] transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.75}
                    />
                  </div>
                  <span className="mt-4 block font-mono text-xs tracking-widest text-[rgb(var(--color-text-muted))]">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-medium text-[rgb(var(--color-text))]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>

                {i < steps.length - 1 && (
                  <>
                    {/* horizontal connector — desktop */}
                    <motion.div
                      variants={arrow}
                      className="hidden md:flex items-center justify-center w-10 shrink-0 origin-left"
                    >
                      <ArrowRight
                        size={18}
                        className="text-[rgb(var(--color-accent))]/50"
                        strokeWidth={1.75}
                      />
                    </motion.div>

                    {/* vertical connector — mobile */}
                    <motion.div
                      variants={arrowVertical}
                      className="flex md:hidden items-center justify-center h-8 origin-top"
                    >
                      <ArrowDown
                        size={18}
                        className="text-[rgb(var(--color-accent))]/50"
                        strokeWidth={1.75}
                      />
                    </motion.div>
                  </>
                )}
              </Fragment>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}