"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function AccountPage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={cardVariants}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
    >
      <h2 className="text-xl font-semibold text-slate-900">Manage Account</h2>
      <p className="mt-2 text-sm text-slate-500">
        Manage subscriptions, billing, and connected accounts. Detailed account tools will be
        added here soon.
      </p>
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-sm font-semibold text-slate-800">Account tools</p>
        <p className="mt-1 text-sm text-slate-500">
          Visit Settings to update your profile or security preferences.
        </p>
        <Link
          href="/workspace/settings"
          className="mt-4 inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          Go to Settings
        </Link>
      </div>
    </motion.div>
  );
}
