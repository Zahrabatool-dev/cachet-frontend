"use client";

import { motion, type Variants } from "framer-motion";
import { Lock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const faqs = [
  {
    question: "How is my data actually encrypted?",
    answer:
      "Every file is encrypted the moment it's uploaded, before it's stored. Only your account can unlock it - not even we can read the contents.",
  },
  {
    question: "What happens when a share link expires?",
    answer:
      "The link stops working immediately. No one can view or download the document after that point, even if they saved the URL.",
  },
  {
    question: "Can I password-protect a shared document?",
    answer:
      "Yes. When creating a share link, you can add an optional password. The recipient will need it before the document opens.",
  },
  {
    question: "What file types can I upload?",
    answer:
      "PDFs and images (JPG, PNG) are supported today, covering most identity, education, financial, medical, and legal documents.",
  },
  {
    question: "Will I be notified before a document expires?",
    answer:
      "Yes. Set an expiry date on any document and you'll get an automatic reminder before it lapses, so nothing catches you off guard.",
  },
  {
    question: "Is there a storage limit?",
    answer:
      "Every account starts with a fixed storage quota, shown as a live usage tracker on your dashboard, so you always know where you stand.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative pt-4 pb-28 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[rgb(var(--color-accent))]">
            Frequently Asked Questions
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-medium text-[rgb(var(--color-text))]">
            Questions, answered
          </h2>
          <p className="mt-4 text-[rgb(var(--color-text-muted))]">
            Everything you'd want to know before trusting us with your
            documents.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={item}>
                <AccordionItem
                  value={`item-${i}`}
                  className="group vault-panel px-6 border-none transition-colors duration-300 data-[state=open]:border-[rgb(var(--color-accent))]/30"
                >
                  <AccordionTrigger className="font-display text-base font-medium text-[rgb(var(--color-text))] hover:no-underline py-5 [&>svg]:text-[rgb(var(--color-text-muted))]">
                    <span className="flex items-center gap-3">
                      <Lock
                        size={14}
                        strokeWidth={1.75}
                        className="shrink-0 text-[rgb(var(--color-accent))]/50 transition-colors duration-300 group-data-[state=open]:text-[rgb(var(--color-accent))]"
                      />
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed pb-5 pl-[26px]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mt-10"
        >
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Still have questions?{" "}
            <a
              href="mailto:support@digitallocker.com"
              className="text-[rgb(var(--color-accent))] font-medium hover:underline underline-offset-4"
            >
              Reach out to us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}