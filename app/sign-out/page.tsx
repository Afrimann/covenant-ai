"use client";

import { motion } from "framer-motion";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirectUrl: "/login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
      >
        <h1 className="text-xl font-semibold text-slate-900">Sign out of ScriptureAI?</h1>
        <p className="mt-2 text-sm text-slate-500">
          You will need to log in again to access your workspace.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Stay signed in
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loading}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
            )}
            Sign out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
