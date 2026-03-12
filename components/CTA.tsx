"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-20" id="cta">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-primary)] px-8 py-12 text-white"
        >
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[color:var(--color-accent)]/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                Get started
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                Start Studying Scripture Smarter Today
              </h2>
              <p className="mt-3 text-sm text-white/80">
                Join pastors and scholars using Covenant AI to prepare, study, and teach with confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[color:var(--color-accent)]/40 blur-xl" />
                <motion.a
                  href="#pricing"
                  className="relative inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold text-[color:var(--color-primary)]"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Free
                </motion.a>
              </div>
              <motion.a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Features
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


