"use client";

import { motion } from "framer-motion";

const capabilities = [
  "Multi-agent biblical intelligence",
  "Scripture-grounded answers",
  "Theology and church history integration",
  "Sermon preparation tools",
];

export default function Solution() {
  return (
    <section className="py-16" id="solution">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="space-y-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--color-accent)">
                The solution
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-(--color-primary)">
                Meet your AI Christian Research Assistant.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-(--color-muted)">
                Covenant AI brings together scripture, theology, and church
                history so you can research with confidence and pastoral care.
              </p>
            </div>
            <div className="space-y-3">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex items-center gap-3 rounded-full border border-(--color-border) bg-white/80 px-4 py-2 text-sm font-medium text-(--color-primary)"
                >
                  <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />
                  {capability}
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl border border-(--color-border) bg-white/90 p-6">
            <div className="absolute left-10 right-10 top-1/2 hidden h-px bg-[color:var(--color-border)] lg:block" />
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                {
                  title: "Your Question",
                  detail: "Faith, suffering, and hope",
                },
                {
                  title: "AI Agents",
                  detail: "Scripture, theology, history",
                },
                {
                  title: "Cross-Checks",
                  detail: "Translations and context",
                },
                {
                  title: "Structured Answer",
                  detail: "Sermon-ready insights",
                },
              ].map((step) => (
                <motion.div
                  key={step.title}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="relative rounded-2xl border border-(--color-border) bg-[color:var(--color-background)] p-4 text-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-accent)">
                    {step.title}
                  </p>
                  <p className="mt-3 font-medium text-(--color-primary)">
                    {step.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
