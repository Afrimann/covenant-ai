import { v } from "convex/values";
import { action, internalAction, internalMutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { runDevotionOrchestrator } from "./agents/devotionOrchestrator";
import { runExplanationAgent } from "./agents/explanationAgent";
import type { Doc } from "./_generated/dataModel";

function getUtcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export const getDevotionByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("dailyDevotions")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .unique();
  },
});

export const getLatestDevotion = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("dailyDevotions").withIndex("by_date", (q) => q).order("desc").first();
  },
});

export const upsertDailyDevotion = internalMutation({
  args: {
    date: v.string(),
    title: v.string(),
    scripture: v.string(),
    reflection: v.string(),
    prayer: v.string(),
    theme: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("dailyDevotions")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .unique();

    if (existing) {
      return existing;
    }

    const id = await ctx.db.insert("dailyDevotions", {
      date: args.date,
      title: args.title,
      scripture: args.scripture,
      reflection: args.reflection,
      prayer: args.prayer,
      theme: args.theme,
      createdAt: Date.now(),
    });

    return ctx.db.get(id);
  },
});

type DailyDevotionDoc = Doc<"dailyDevotions">;
type DailyDevotionResult = DailyDevotionDoc | null;

export const ensureDailyDevotion: ReturnType<typeof internalAction> = internalAction({
  args: { date: v.optional(v.string()) },
  handler: async (ctx, args): Promise<DailyDevotionResult> => {
    const date = args.date ?? getUtcDateString();
    const existing: DailyDevotionResult = await ctx.runQuery(api.devotions.getDevotionByDate, {
      date,
    });
    if (existing) {
      return existing;
    }

    const generated = await runDevotionOrchestrator({ date });
    return ctx.runMutation(internal.devotions.upsertDailyDevotion, {
      date: generated.date,
      title: generated.title,
      scripture: generated.scripture,
      reflection: generated.reflection,
      prayer: generated.prayer,
      theme: generated.theme,
    });
  },
});
  
export const getOrCreateDailyDevotion = action({
  args: { date: v.optional(v.string()) },
  handler: async (ctx, args): Promise<DailyDevotionResult> => {
    return ctx.runAction(internal.devotions.ensureDailyDevotion, { date: args.date });
  },
});

export const explainDevotion = action({
  args: {
    date: v.optional(v.string()),
    focus: v.optional(v.union(v.literal("scripture"), v.literal("devotion"))),
  },
  handler: async (ctx, args): Promise<string> => {
    const date = args.date ?? getUtcDateString();
    const devotion = await ctx.runAction(internal.devotions.ensureDailyDevotion, { date });
    if (!devotion) {
      throw new Error(`Devotion not found for date ${date}.`);
    }

    return runExplanationAgent({
      title: devotion.title,
      scripture: devotion.scripture,
      theme: devotion.theme,
      reflection: devotion.reflection,
      focus: args.focus ?? "scripture",
    });
  },
});
