"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Login", href: "/login" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur bg-white/80 shadow-sm border-b border-(--color-border)"
          : "bg-white/30"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-sm font-semibold text-white">
            CA
          </span>
          <span className="text-lg font-semibold tracking-tight text-(--color-primary)">
            Covenant AI
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm font-medium text-(--color-primary) lg:flex"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-(--color-accent)"
            >
              {item.label}
            </a>
          ))}
          <motion.a
            href="#cta"
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(11,31,58,0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.a>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) text-(--color-primary) lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-(--color-border) bg-white/95 backdrop-blur lg:hidden"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-sm font-medium text-(--color-primary)">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition-colors hover:text-(--color-accent)"
                >
                  {item.label}
                </a>
              ))}
              <motion.a
                href="#cta"
                className="inline-flex w-fit rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm"
                whileHover={{
                  y: -2,
                  boxShadow: "0 12px 24px rgba(11,31,58,0.2)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
