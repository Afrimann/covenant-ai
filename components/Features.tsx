"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "AI Biblical Research",
    description:
      "Ask deep theological questions and receive scripture-grounded answers.",
  },
  {
    title: "Sermon Builder",
    description:
      "Generate sermon outlines, supporting verses, illustrations, and teaching notes.",
    bullets: [
      "Sermon outlines",
      "Supporting verses",
      "Illustrations",
      "Teaching notes",
    ],
  },
  {
    title: "Bible Study Planner",
    description:
      "Generate structured study plans for communities and personal devotion.",
    bullets: ["7-day studies", "30-day devotionals", "Topical studies"],
  },
  {
    title: "Scripture Explorer",
    description: "Discover related passages instantly across the canon.",
  },
  {
    title: "Church History References",
    description:
      "AI references Augustine of Hippo, Thomas Aquinas, and Martin Luther.",
  },
];

export default function Features() {
  return (
    <section className="py-16" id="features">
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
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-(--color-primary)">
              Everything you need for faithful study
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{
                  y: -6,
                  boxShadow: "0 18px 40px rgba(11,31,58,0.12)",
                }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                className="rounded-2xl border border-(--color-border) bg-white/90 p-6"
              >
                <h3 className="text-lg font-semibold text-(--color-primary)">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-(--color-muted)">
                  {feature.description}
                </p>
                {feature.bullets && (
                  <ul className="mt-4 space-y-2 text-sm text-(--color-primary)">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
