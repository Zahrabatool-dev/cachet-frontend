"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring, type Variants } from "framer-motion";
import { Logo } from "./Logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const mobileContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const mobileItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.19, 1, 0.22, 1] } },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // thin progress line under the navbar — reinforces the "vault dial" motion language
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: highlight the nav link for whichever section is in view
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" } // triggers when section is roughly centered
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-[rgb(var(--color-accent))]/15 shadow-[0_2px_20px_rgb(22_26_24_/_0.04)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="shrink-0 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-accent))]/50 focus-visible:ring-offset-2">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm transition-colors duration-200 group focus-visible:outline-none focus-visible:text-[rgb(var(--color-accent))] ${
                  isActive
                    ? "text-[rgb(var(--color-accent))]"
                    : "text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent))]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-[rgb(var(--color-accent))] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-[rgb(var(--color-text))] hover:text-[rgb(var(--color-accent))] transition-colors duration-200 focus-visible:outline-none focus-visible:text-[rgb(var(--color-accent))]"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-shimmer text-sm font-medium px-4 py-2 rounded-md bg-[rgb(var(--color-accent))] text-white shadow-[0_0_16px_rgb(var(--color-accent)_/_0.25)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_22px_rgb(var(--color-accent)_/_0.4)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-accent))]/50 focus-visible:ring-offset-2"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-accent))]/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-accent))]/50"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      {/* scroll progress — thin accent line, echoes the dial/lock motif elsewhere on the page */}
      <motion.div
        style={{ scaleX: progress }}
        className="h-px w-full origin-left bg-[rgb(var(--color-accent))]/60"
      />

      {/* Mobile dropdown — real motion instead of max-h hack */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-b border-[rgb(var(--color-accent))]/15"
          >
            <motion.div
              variants={mobileContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col px-6 py-4 gap-4"
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  variants={mobileItem}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm transition-colors duration-200 ${
                    activeSection === link.href
                      ? "text-[rgb(var(--color-accent))]"
                      : "text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent))]"
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div variants={mobileItem} className="h-px bg-[rgb(var(--color-accent))]/15 my-1" />
              <motion.div variants={mobileItem}>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-[rgb(var(--color-text))] hover:text-[rgb(var(--color-accent))] transition-colors duration-200"
                >
                  Log in
                </Link>
              </motion.div>
              <motion.div variants={mobileItem}>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-shimmer block text-sm font-medium px-4 py-2.5 rounded-md bg-[rgb(var(--color-accent))] text-white text-center hover:brightness-110 transition-all duration-200"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}