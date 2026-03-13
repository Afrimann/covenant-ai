"use client";

import { motion } from "framer-motion";

const problems = [
  {
    title: "Finding connected scriptures is difficult",
    description: "Tracing themes across the canon often feels fragmented.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d="M5 6h14M5 12h10M5 18h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Preparing sermons takes hours",
    description: "Outlines, illustrations, and references take time to gather.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d="M8 3h8a2 2 0 0 1 2 2v14l-6-3-6 3V5a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Theology research requires multiple sources",
    description: "Scholarly insight spans scripture, tradition, and history.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d="M4 5h8v14H4zM12 5h8v14h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Generic AI tools give inaccurate religious answers",
    description: "Without scripture grounding, results can mislead.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 8v5M12 16h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function Problem() {
  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="space-y-10"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--color-accent)">
              The problem
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-(--color-primary)">
              Studying the Bible deeply takes time.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {problems.map((problem) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-(--color-border) bg-white/90 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-background)] text-(--color-primary)">
                    {problem.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-(--color-primary)">
                      {problem.title}
                    </h3>
                    <p className="mt-2 text-sm text-(--color-muted)">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
