"use client";

import { useEffect, useState } from "react";
import { isIosDevice, isStandaloneDisplayMode } from "@/lib/pwa";

const DISMISSED_KEY = "scriptureai:ios-install-dismissed";

export default function IosInstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isIosDevice() || isStandaloneDisplayMode()) return;
    if (localStorage.getItem(DISMISSED_KEY) === "1") return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-(--color-border) bg-(--color-card) p-4 shadow-xl sm:inset-x-auto sm:right-4 sm:w-80">
      <p className="text-sm font-semibold text-(--color-primary)">
        Install ScriptureAI
      </p>
      <p className="mt-1 text-xs text-(--color-muted)">
        Add ScriptureAI to your Home Screen to use it like an app and enable
        notifications: tap the Share icon{" "}
        <span aria-hidden="true">⎋</span> in Safari, then{" "}
        <span className="font-medium text-(--color-foreground)">
          Add to Home Screen
        </span>
        .
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 rounded-full bg-[color:var(--color-accent)] px-4 py-1.5 text-xs font-semibold text-(--color-primary)"
      >
        Got it
      </button>
    </div>
  );
}
