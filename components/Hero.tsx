"use client";

import { motion } from "framer-motion";

const container = "mx-auto w-full max-w-6xl px-6 sm:px-8";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function LivePreview() {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-(--color-border) bg-white/90 p-5 shadow-[0_20px_40px_rgba(11,31,58,0.08)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-accent)">
          Live AI Preview
        </span>
        <span className="text-xs text-(--color-muted)">Covenant AI</span>
      </div>
      <div className="mt-4 space-y-4">
        <div className="rounded-xl bg-(--color-background) p-3">
          <p className="text-xs font-semibold text-(--color-primary)">You</p>
          <p className="mt-1 text-sm text-(--color-primary)">
            Explain the Trinity
          </p>
        </div>
        <div className="rounded-xl border border-(--color-border) bg-white p-3">
          <p className="text-xs font-semibold text-(--color-primary)">
            AI Research Preview
          </p>
          <p className="mt-1 text-sm text-(--color-muted)">
            The Trinity reveals one God in three persons. See{" "}
            <span className="font-serif text-(--color-primary)">
              Matthew 28:19
            </span>{" "}
            and{" "}
            <span className="font-serif text-(--color-primary)">
              2 Corinthians 13:14
            </span>{" "}
            for the unified witness of Father, Son, and Holy Spirit.
          </p>
        </div>
        <div>
          <label htmlFor="preview-input" className="sr-only">
            Live preview input
          </label>
          <input
            id="preview-input"
            aria-label="Live preview input"
            className="w-full rounded-full border border-(--color-border) bg-white px-4 py-2 text-sm text-(--color-primary) placeholder:text-(--color-muted)"
            value="Explain the Trinity"
            readOnly
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="pb-16 pt-24 sm:pt-28">
      <div className={container}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-(--color-primary)"
            >
              Trusted research, reverent tone
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-semibold leading-tight text-(--color-primary) sm:text-5xl lg:text-6xl"
            >
              AI-Powered Biblical Research for Christians, Pastors, and Scholars
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-lg leading-relaxed text-(--color-muted)"
            >
              Study scripture deeper, prepare sermons faster, and explore
              Christian theology with an intelligent research assistant grounded
              in biblical truth.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <motion.a
                href="#pricing"
                className="rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(11,31,58,0.18)]"
                whileHover={{
                  y: -2,
                  boxShadow: "0 24px 40px rgba(11,31,58,0.25)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free
              </motion.a>
              <motion.a
                href="#how-it-works"
                className="rounded-full border border-(--color-border) bg-white px-6 py-3 text-sm font-semibold text-(--color-primary)"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                See How It Works
              </motion.a>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-6 text-sm text-(--color-muted)"
            >
              <span className="font-semibold text-(--color-primary)">
                Scripture-first answers
              </span>
              <span>Multi-agent research</span>
              <span>Church history insights</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative"
          >
            <div className="absolute -left-8 top-10 hidden h-32 w-32 rounded-full bg-[color:var(--color-accent)]/15 blur-3xl lg:block" />
            <div className="absolute -bottom-10 right-0 hidden h-40 w-40 rounded-full bg-[color:var(--color-primary)]/10 blur-3xl lg:block" />

            <div className="rounded-3xl border border-(--color-border) bg-white/90 p-6 shadow-[0_24px_60px_rgba(11,31,58,0.12)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-(--color-primary)">
                    Covenant AI Dashboard
                  </p>
                  <p className="text-xs text-(--color-muted)">
                    Live biblical research workspace
                  </p>
                </div>
                <span className="rounded-full bg-[color:var(--color-background)] px-3 py-1 text-xs font-semibold text-(--color-primary)">
                  Secure
                </span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-(--color-border) bg-[color:var(--color-background)] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-accent)">
                    AI Chat Interface
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-(--color-muted)">
                    <div className="rounded-lg bg-white px-3 py-2 text-(--color-primary)">
                      Summarize Romans 8:28.
                    </div>
                    <div className="rounded-lg border border-(--color-border) bg-white px-3 py-2">
                      All things work together for good in Christ.
                    </div>
                  </div>
                </motion.div>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-(--color-border) bg-white p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-accent)">
                      Sermon Generator
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-(--color-muted)">
                      <li>Outline, illustrations, application</li>
                      <li>Supporting verses ready</li>
                    </ul>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-(--color-border) bg-white p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-accent)">
                      Scripture References
                    </p>
                    <p className="mt-3 text-sm text-(--color-muted)">
                      Cross-links, parallels, and historical context.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <LivePreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
