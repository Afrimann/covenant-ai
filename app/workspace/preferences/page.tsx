"use client";

import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function PreferencesPage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={cardVariants}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
    >
      <h2 className="text-xl font-semibold text-slate-900">Preferences</h2>
      <p className="mt-2 text-sm text-slate-500">
        Tailor ScriptureAI to your study style. These settings will integrate with the AI
        workspace.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {["Translation", "Devotion cadence", "Sermon hints", "Historical sources"].map(
          (item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              {item}
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}
