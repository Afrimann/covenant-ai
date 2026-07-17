"use node";

import webpush from "web-push";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

type PushResult = { sent: number; failed: number };

function getVapidDetails() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:support@scriptureai.app";
  if (!publicKey || !privateKey) {
    throw new Error("Missing VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY environment variables.");
  }
  return { publicKey, privateKey, subject };
}

async function deliverPush(
  ctx: ActionCtx,
  subscriptions: Doc<"pushSubscriptions">[],
  payload: { title: string; body: string; url?: string }
): Promise<PushResult> {
  const message = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/workspace",
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, message)
    )
  );

  await Promise.all(
    results.map(async (result, i) => {
      if (result.status !== "rejected") return;
      const statusCode = (result.reason as { statusCode?: number })?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await ctx.runMutation(internal.pushSubscriptions.deleteSubscriptionByEndpoint, {
          endpoint: subscriptions[i].endpoint,
        });
      }
    })
  );

  return {
    sent: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
  };
}

export const sendPushToUser = internalAction({
  args: {
    userId: v.string(),
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<PushResult> => {
    const { publicKey, privateKey, subject } = getVapidDetails();
    webpush.setVapidDetails(subject, publicKey, privateKey);

    const subscriptions: Doc<"pushSubscriptions">[] = await ctx.runQuery(
      internal.pushSubscriptions.listSubscriptionsByUser,
      { userId: args.userId }
    );

    return deliverPush(ctx, subscriptions, {
      title: args.title,
      body: args.body,
      url: args.url,
    });
  },
});

// Generates (or reuses) today's devotion via the existing devotions flow,
// then broadcasts it to every stored push subscription. Wired up as the
// daily-devotion cron's target in convex/crons.ts.
export const notifyDailyDevotionSubscribers = internalAction({
  args: {},
  handler: async (ctx): Promise<PushResult> => {
    const devotion: Doc<"dailyDevotions"> | null = await ctx.runAction(
      internal.devotions.ensureDailyDevotion,
      {}
    );
    if (!devotion) {
      return { sent: 0, failed: 0 };
    }

    const { publicKey, privateKey, subject } = getVapidDetails();
    webpush.setVapidDetails(subject, publicKey, privateKey);

    const subscriptions: Doc<"pushSubscriptions">[] = await ctx.runQuery(
      internal.pushSubscriptions.listAllSubscriptions,
      {}
    );

    return deliverPush(ctx, subscriptions, {
      title: `Today's Devotion: ${devotion.title}`,
      body: devotion.scripture,
      url: "/workspace/daily-devotions",
    });
  },
});
