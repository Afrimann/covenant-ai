"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Ask a question",
    example: "Explain faith during suffering.",
    details: "Your prompt sets the theological focus.",
  },
  {
    title: "AI research agents collaborate",
    example: "They analyze scripture, theology, and historical writings.",
    details: "Agents cross-check sources for accuracy.",
  },
  {
    title: "Receive structured answers",
    example: "Bible references, explanations, historical context.",
    details: "Ready for sermons, teaching, and study notes.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16" id="how-it-works">
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
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-(--color-primary)">
              Three steps from question to clarity
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                className="rounded-2xl border border-(--color-border) bg-white/90 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-background)] text-sm font-semibold text-(--color-primary)">
                    0{index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-(--color-primary)">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-(--color-muted)">
                  {step.example}
                </p>
                <p className="mt-2 text-sm text-(--color-primary)">
                  {step.details}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
