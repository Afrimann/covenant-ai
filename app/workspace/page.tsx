"use client";

import { useState, useEffect, useRef } from "react";
import { FiBookOpen, FiBook, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

const stats = [
  { label: "Studies", count: 12, icon: FiBookOpen, color: "bg-blue-100", progress: 60 },
  { label: "Sermons", count: 7, icon: FiBook, color: "bg-green-100", progress: 45 },
  { label: "Insights", count: 20, icon: FiZap, color: "bg-yellow-100", progress: 80 },
];

const recentSermons = [
  { title: "Faith and Patience", date: "2026-03-14", theme: "Trust in God" },
  { title: "Walking in the Spirit", date: "2026-03-13", theme: "Holy Spirit" },
  { title: "Love Thy Neighbor", date: "2026-03-12", theme: "Christian Ethics" },
  { title: "Overcoming Doubt", date: "2026-03-11", theme: "Faith Challenges" },
  { title: "Living in Grace", date: "2026-03-10", theme: "Grace & Forgiveness" },
  { title: "Power of Prayer", date: "2026-03-09", theme: "Prayer & Devotion" },
];

export default function WorkspaceDashboardPage() {
  const [hour, setHour] = useState<number>(new Date().getHours());
  const [greeting, setGreeting] = useState<string>("Welcome");
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    setHour(new Date().getHours());
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [hour]);

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  };

  function formatDate(dateString: string) {
    const date = new Date(`${dateString}T00:00:00Z`);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setShowArrow(scrollTop + clientHeight < scrollHeight - 5);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">
          {greeting}, {user?.firstName || "ScriptureAI User"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Your AI-powered biblical research assistant is ready to help.
        </p>
      </div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-3"
      >
        {stats.map(({ label, count, icon: Icon, color, progress }) => (
          <motion.div
            key={label}
            variants={cardVariants}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_30px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {label}
              </p>
              <div className={`p-2 rounded-full ${color}`}>
                <Icon className="h-5 w-5 text-slate-800" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{count}</p>
            <p className="mt-1 text-xs text-slate-500">This month</p>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-slate-900" style={{ width: `${progress}%` }}></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Insights */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
      >
        <h3 className="text-lg font-semibold text-slate-900">AI Insights</h3>
        <p className="mt-2 text-sm text-slate-500">
          You've completed {stats[1].progress}% of your sermon goals this month. Consider generating 1 more outline to reach 100%.
        </p>
        <div className="mt-4">
          <button className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
            <FiZap className="mr-2 h-5 w-5" />
            Generate New Sermon Outline
          </button>
        </div>
      </motion.div>

      {/* Recent Sermons / Studies */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)] scrollbar-none"
      >
        <h3 className="text-lg font-semibold text-slate-900">Recent Sermons & Studies</h3>
        <div
          ref={scrollRef}
          className="mt-4 max-h-72 overflow-y-auto scrollbar-none relative"
          onScroll={handleScroll}
        >
          {recentSermons.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
              </div>
              <p className="mt-1 text-xs text-slate-600">{item.theme}</p>
            </motion.div>
          ))}
          <div className="h-6" /> {/* Bottom padding for arrow */}
        </div>

        {/* Scroll indicator arrow */}
        {showArrow && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition-opacity duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </motion.div>
    </div>
  );
}