"use client";

import { motion } from "framer-motion";
import { useAction, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";

type ExplanationFocus = "scripture" | "devotion";

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

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DailyDevotionsPage() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const devotion = useQuery(api.devotions.getDevotionByDate, { date: today });
  const getOrCreateDevotion = useAction(api.devotions.getOrCreateDailyDevotion);
  const explainDevotion = useAction(api.devotions.explainDevotion);
  const [hasRequested, setHasRequested] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explanationFocus, setExplanationFocus] = useState<ExplanationFocus>("scripture");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (devotion === null && !hasRequested) {
      setHasRequested(true);
      setIsGenerating(true);
      setErrorMessage(null);
      getOrCreateDevotion({ date: today })
        .catch((error) => {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to generate today's devotion.",
          );
        })
        .finally(() => {
          setIsGenerating(false);
        });
    }
  }, [devotion, getOrCreateDevotion, hasRequested, today]);

  useEffect(() => {
    setExplanation(null);
    setErrorMessage(null);
  }, [devotion?.date]);

  const handleExplain = async (focus: ExplanationFocus) => {
    if (!devotion) {
      return;
    }
    setIsExplaining(true);
    setErrorMessage(null);
    setExplanationFocus(focus);
    try {
      const text = await explainDevotion({ date: devotion.date, focus });
      setExplanation(text);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to generate the explanation.",
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const isLoading = devotion === undefined;
  const isEmpty = devotion === null && !isGenerating;
  const isGeneratingNow = devotion === null && isGenerating;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">ScriptureAI</p>
        <h1 className="text-2xl font-semibold text-slate-900">Daily Devotions</h1>
        <p className="text-sm text-slate-500">
          Refresh your spirit with daily reflections and AI-powered study tools.
        </p>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        <motion.article
          variants={cardVariants}
          className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
        >
          {isLoading && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Loading
              </span>
              <p className="text-sm text-slate-500">Fetching today&apos;s devotion.</p>
            </div>
          )}

          {isEmpty && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Not Ready
              </span>
              <p className="text-sm text-slate-500">
                Today&apos;s devotion has not been generated yet. Please refresh in a moment.
              </p>
            </div>
          )}

          {isGeneratingNow && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Generating
              </span>
              <p className="text-sm text-slate-500">
                We&apos;re preparing today&apos;s devotion. This usually takes less than a minute.
              </p>
            </div>
          )}

          {devotion && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>{formatDate(devotion.date)}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
                  {devotion.theme}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{devotion.title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-600">{devotion.scripture}</p>
              </div>
              <p className="text-sm leading-6 text-slate-600">{devotion.reflection}</p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Prayer
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{devotion.prayer}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}

          {devotion && (
            <div className="mt-6 flex flex-col gap-2">
              <ActionButton
                label="Explain Scripture"
                onClick={() => handleExplain("scripture")}
                loading={isExplaining && explanationFocus === "scripture"}
                disabled={isExplaining || isGenerating}
              />
              <ActionButton
                label="Explain Devotion"
                onClick={() => handleExplain("devotion")}
                loading={isExplaining && explanationFocus === "devotion"}
                disabled={isExplaining || isGenerating}
              />
            </div>
          )}
        </motion.article>
      </motion.div>

      {explanation && (
        <motion.section
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {explanationFocus === "scripture" ? "Scripture Explanation" : "Devotion Explanation"}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
            {explanation}
          </p>
        </motion.section>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  loading,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Generating..." : label}
    </button>
  );
}
