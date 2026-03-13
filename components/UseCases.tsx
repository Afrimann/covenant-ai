"use client";

import { motion } from "framer-motion";

const useCases = [
  {
    title: "Pastors",
    description: "Prepare sermons faster with trusted sources.",
  },
  {
    title: "Students",
    description: "Study theology deeper with guided analysis.",
  },
  {
    title: "Believers",
    description: "Understand scripture clearly and confidently.",
  },
];

export default function UseCases() {
  return (
    <section className="py-16" id="use-cases">
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
              Use cases
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-(--color-primary)">
              Built for every stage of ministry
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {useCases.map((useCase) => (
              <motion.div
                key={useCase.title}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                className="rounded-2xl border border-(--color-border) bg-white/90 p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-background)] text-lg font-semibold text-(--color-primary)">
                  {useCase.title.slice(0, 1)}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-(--color-primary)">
                  {useCase.title}
                </h3>
                <p className="mt-2 text-sm text-(--color-muted)">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
