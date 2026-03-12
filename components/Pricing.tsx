"use client";

import { motion } from "framer-motion";

const plans = [
  {
    title: "Free",
    price: "$0",
    description: "For starting your study journey.",
    features: [
      "Limited AI questions",
      "Daily devotional",
      "Scripture search",
    ],
  },
  {
    title: "Pro",
    price: "$29",
    description: "For pastors and teachers.",
    features: [
      "Unlimited research",
      "Sermon generator",
      "Study plans",
    ],
    recommended: true,
  },
  {
    title: "Premium",
    price: "$79",
    description: "For advanced theological research.",
    features: [
      "Advanced theology research",
      "Church history insights",
      "Export notes",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="py-16" id="pricing">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="space-y-10"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-accent)]">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[color:var(--color-primary)]">
              Simple plans for every calling
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <motion.div
                key={plan.title}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className={`relative rounded-2xl border bg-white/95 p-6 shadow-[0_18px_40px_rgba(11,31,58,0.1)] ${
                  plan.recommended
                    ? "border-[color:var(--color-accent)]"
                    : "border-[color:var(--color-border)]"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[color:var(--color-accent)] px-3 py-1 text-xs font-semibold text-[color:var(--color-primary)]">
                    Recommended
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold text-[color:var(--color-primary)]">
                    {plan.title}
                  </h3>
                  <span className="text-2xl font-semibold text-[color:var(--color-primary)]">
                    {plan.price}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                  {plan.description}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[color:var(--color-primary)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.a
                  href="#cta"
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-2 text-sm font-semibold ${
                    plan.recommended
                      ? "bg-[color:var(--color-primary)] text-white"
                      : "border border-[color:var(--color-border)] text-[color:var(--color-primary)]"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


