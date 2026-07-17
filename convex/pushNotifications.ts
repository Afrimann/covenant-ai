"use node";

import webpush from "web-push";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

function getVapidDetails() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:support@scriptureai.app";
  if (!publicKey || !privateKey) {
    throw new Error("Missing VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY environment variables.");
  }
  return { publicKey, privateKey, subject };
}

export const sendPushToUser = internalAction({
  args: {
    userId: v.string(),
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ sent: number; failed: number }> => {
    const { publicKey, privateKey, subject } = getVapidDetails();
    webpush.setVapidDetails(subject, publicKey, privateKey);

    const subscriptions: Doc<"pushSubscriptions">[] = await ctx.runQuery(
      internal.pushSubscriptions.listSubscriptionsByUser,
      { userId: args.userId }
    );

    const payload = JSON.stringify({
      title: args.title,
      body: args.body,
      url: args.url ?? "/workspace",
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          payload
        )
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
  },
});
