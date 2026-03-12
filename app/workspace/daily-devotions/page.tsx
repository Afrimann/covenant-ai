"use client";

import { motion } from "framer-motion";

type Devotion = {
  date: string;
  title: string;
  scripture: string;
  reflection: string;
};

const devotions: Devotion[] = [
  {
    date: "Today",
    title: "Anchored in Hope",
    scripture: "Hebrews 6:19",
    reflection:
      "Hope secures the soul when everything else shifts. Spend time today anchoring your mind in Christ’s steady promises.",
  },
  {
    date: "Tomorrow",
    title: "Grace for the Journey",
    scripture: "2 Corinthians 12:9",
    reflection:
      "God’s strength meets us in weakness. Let grace be your companion in the work and conversations ahead.",
  },
  {
    date: "This Week",
    title: "Wisdom in the Word",
    scripture: "James 1:5",
    reflection:
      "The Lord gives wisdom generously. Pray with expectancy and listen for the Spirit’s guidance today.",
  },
  {
    date: "This Week",
    title: "Peace That Holds",
    scripture: "Philippians 4:6-7",
    reflection:
      "Peace follows prayer and gratitude. Trade worry for conversation with God and rest in His care.",
  },
  {
    date: "This Week",
    title: "Love in Action",
    scripture: "John 13:34-35",
    reflection:
      "Jesus’ love is a visible witness. Ask Him to shape your actions so they reflect His heart.",
  },
  {
    date: "This Week",
    title: "Light for the Path",
    scripture: "Psalm 119:105",
    reflection:
      "Scripture is a lamp in uncertain seasons. Invite the Word to guide your next step.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function DailyDevotionsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          ScriptureAI
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">Daily Devotions</h1>
        <p className="text-sm text-slate-500">
          Refresh your spirit with daily reflections and AI-powered study tools.
        </p>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        {devotions.map((devotion) => (
          <motion.article
            key={`${devotion.title}-${devotion.scripture}`}
            variants={cardVariants}
            className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]"
          >
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {devotion.date}
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{devotion.title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-600">{devotion.scripture}</p>
              </div>
              <p className="text-sm text-slate-500">{devotion.reflection}</p>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <ActionButton label="Explain Scripture" />
              <ActionButton label="Generate Prayer" />
              <ActionButton label="Show Related Scriptures" />
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
    >
      {label}
    </button>
  );
}
