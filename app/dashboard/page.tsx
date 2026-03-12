"use client";

import { AnimatePresence, motion } from "framer-motion";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Option = {
  label: string;
  value: string;
};

type Question = {
  id: string;
  prompt: string;
  helper?: string;
  options: Option[];
};

const questions: Question[] = [
  {
    id: "primary_use",
    prompt: "What will you mostly use ScriptureAI for?",
    helper: "This helps us tailor your workspace recommendations.",
    options: [
      { label: "Personal Bible Study", value: "Personal Bible Study" },
      { label: "Sermon Preparation", value: "Sermon Preparation" },
      { label: "Theology Research", value: "Theology Research" },
      { label: "Teaching", value: "Teaching" },
    ],
  },
  {
    id: "translation",
    prompt: "What is your preferred Bible translation?",
    options: [
      { label: "NIV", value: "NIV" },
      { label: "ESV", value: "ESV" },
      { label: "KJV", value: "KJV" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    id: "role",
    prompt: "Are you a pastor, student, or believer?",
    options: [
      { label: "Pastor", value: "Pastor" },
      { label: "Student", value: "Student" },
      { label: "Believer", value: "Believer" },
    ],
  },
  {
    id: "sermon_outlines",
    prompt: "Do you want sermon outline suggestions?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "historical_refs",
    prompt: "Do you want historical/theological references in your answers?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
  },
];

export default function DashboardPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[stepIndex];
  const totalSteps = questions.length;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);
  const router = useRouter()

  const isAnswered = useMemo(
    () => Boolean(answers[currentQuestion?.id]),
    [answers, currentQuestion?.id]
  );

  const handleSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!isAnswered) return;
    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      console.info("Onboarding answers:", answers);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((prev) => prev - 1);
  };

  const handleSkip = () => {
    setCompleted(true);
    console.info("Onboarding skipped. Answers:", answers);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key={`step-${currentQuestion?.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              <span>Onboarding</span>
              <span>
                Step {stepIndex + 1} of {totalSteps}
              </span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-900 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-6 space-y-3">
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {currentQuestion.prompt}
              </h1>
              {currentQuestion.helper && (
                <p className="text-sm text-slate-500">{currentQuestion.helper}</p>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => {
                const isActive = answers[currentQuestion.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={stepIndex === 0}
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-sm font-semibold text-slate-500 transition hover:text-slate-800"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {stepIndex === totalSteps - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10"
          >
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              You are all set
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              We will personalize ScriptureAI based on your preferences.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={() => router.push("/workspace")}
            >
              Continue to workspace
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
