"use client";

import { motion } from "framer-motion";

const audiences = [
  "Pastors",
  "Bible Teachers",
  "Seminary Students",
  "Christian Researchers",
];

export default function SocialProof() {
  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="space-y-8"
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--color-accent)">
              Built for those who study and teach the Word.
            </p>
            <h2 className="text-3xl font-semibold text-(--color-primary)">
              A trusted companion for every calling
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => (
              <motion.div
                key={audience}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="rounded-2xl border border-(--color-border) bg-white/90 p-5 text-sm font-semibold text-(--color-primary) shadow-[0_16px_36px_rgba(11,31,58,0.08)]"
              >
                {audience}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
