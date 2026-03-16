"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function SermonBuilderPage() {
  const [concept, setConcept] = useState("");
  const [context, setContext] = useState("");
  const [outline, setOutline] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  // const generateOutline = api.sermons.generateOutline; // Convex action

  const handleGenerateOutline = async () => {
    if (!concept.trim()) return;
    setIsGenerating(true);
    setOutline(null);
    try {
      // const result = await generateOutline({ concept, context });
      // setOutline(result.outline);
    } catch (err) {
      console.error(err);
      setOutline("Unable to generate outline. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          ScriptureAI
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">Sermon Builder</h1>
        <p className="text-sm text-slate-500">
          Provide a concept and context, and AI will generate a sermon outline with Scripture and key points.
        </p>
      </header>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6">
        <motion.article
          variants={cardVariants}
          className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
        >
          <label className="block text-sm font-medium text-slate-700">Sermon Concept</label>
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="E.g., Faith and perseverance"
            className="mt-1 mb-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
          />

          <label className="block text-sm font-medium text-slate-700">Context / Notes (optional)</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="E.g., Youth group, small congregation, 20-minute sermon"
            className="mt-1 mb-4 w-full resize-none rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
            rows={3}
          />

          <button
            type="button"
            onClick={handleGenerateOutline}
            disabled={isGenerating || !concept.trim()}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Create Outline"}
          </button>

          {outline && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-line">
              {outline}
            </div>
          )}
        </motion.article>
      </motion.div>
    </div>
  );
}