"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isIosDevice, isStandaloneDisplayMode, urlBase64ToUint8Array } from "@/lib/pwa";

function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function subscribeToPush(
  savePushSubscription: ReturnType<typeof useMutation<typeof api.pushSubscriptions.savePushSubscription>>,
  userId: string
) {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY environment variable.");
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  }

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Push subscription is missing required fields.");
  }

  await savePushSubscription({
    userId,
    endpoint: json.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    userAgent: navigator.userAgent,
  });
}

export default function PushPermissionManager() {
  const { isSignedIn, user } = useUser();
  const savePushSubscription = useMutation(api.pushSubscriptions.savePushSubscription);
  const [status, setStatus] = useState<"idle" | "prompting" | "error">("idle");
  const [showBanner, setShowBanner] = useState(false);

  const eligible =
    isSignedIn &&
    pushSupported() &&
    (!isIosDevice() || isStandaloneDisplayMode());

  useEffect(() => {
    if (!eligible || !user) return;

    if (Notification.permission === "granted") {
      subscribeToPush(savePushSubscription, user.id).catch(() => {
        // Silent: a background resync failure shouldn't interrupt the user.
      });
      return;
    }

    if (Notification.permission === "default") {
      setShowBanner(true);
    }
  }, [eligible, user, savePushSubscription]);

  if (!showBanner) return null;

  async function handleEnable() {
    if (!user) return;
    setStatus("prompting");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setShowBanner(false);
        return;
      }
      await subscribeToPush(savePushSubscription, user.id);
      setShowBanner(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border border-(--color-border) bg-(--color-card) p-4 shadow-xl sm:inset-x-auto sm:left-4 sm:w-80">
      <p className="text-sm font-semibold text-(--color-primary)">
        Stay in the Word
      </p>
      <p className="mt-1 text-xs text-(--color-muted)">
        Turn on notifications for daily devotions and study updates.
      </p>
      {status === "error" && (
        <p className="mt-1 text-xs text-red-600">
          Couldn&apos;t enable notifications. Please try again.
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleEnable}
          disabled={status === "prompting"}
          className="rounded-full bg-[color:var(--color-accent)] px-4 py-1.5 text-xs font-semibold text-(--color-primary) disabled:opacity-60"
        >
          Enable Notifications
        </button>
        <button
          type="button"
          onClick={() => setShowBanner(false)}
          className="rounded-full border border-(--color-border) px-4 py-1.5 text-xs font-semibold text-(--color-muted)"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
