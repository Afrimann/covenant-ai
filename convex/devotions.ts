import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { runDevotionOrchestrator } from "./agents/devotionOrchestrator";
import { runExplanationAgent } from "./agents/explanationAgent";
import type { Doc } from "./_generated/dataModel";

type DailyDevotionDoc = Doc<"dailyDevotions">;
type DailyDevotionResult = DailyDevotionDoc | null;

const UNIQUE_ATTEMPTS = 5;
const AVOID_LIST_LIMIT = 40;

function getUtcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildDevotionSignature(
  devotion: Pick<DailyDevotionDoc, "title" | "scripture" | "reflection" | "prayer" | "theme">,
): string {
  return [
    devotion.title,
    devotion.scripture,
    devotion.theme,
    devotion.reflection,
    devotion.prayer,
  ]
    .map(normalizeText)
    .join("|");
}

function collectUnique(values: string[], limit: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    out.push(trimmed);
    if (out.length >= limit) {
      break;
    }
  }
  return out;
}

function seedAvoidLists(devotions: DailyDevotionDoc[]) {
  return {
    scriptures: collectUnique(
      devotions.map((devotion) => devotion.scripture),
      AVOID_LIST_LIMIT,
    ),
    titles: collectUnique(
      devotions.map((devotion) => devotion.title),
      AVOID_LIST_LIMIT,
    ),
    themes: collectUnique(
      devotions.map((devotion) => devotion.theme),
      AVOID_LIST_LIMIT,
    ),
  };
}

function addAvoid(
  avoid: { scriptures: string[]; titles: string[]; themes: string[] },
  devotion: Pick<DailyDevotionDoc, "scripture" | "title" | "theme">,
) {
  if (!avoid.scriptures.includes(devotion.scripture)) {
    avoid.scriptures.push(devotion.scripture);
  }
  if (!avoid.titles.includes(devotion.title)) {
    avoid.titles.push(devotion.title);
  }
  if (!avoid.themes.includes(devotion.theme)) {
    avoid.themes.push(devotion.theme);
  }
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

export const listDailyDevotionsForDedup = internalQuery({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("dailyDevotions")
      .withIndex("by_date", (q) => q)
      .order("desc")
      .collect();
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

export const replaceDailyDevotion = internalMutation({
  args: {
    id: v.id("dailyDevotions"),
    date: v.string(),
    title: v.string(),
    scripture: v.string(),
    reflection: v.string(),
    prayer: v.string(),
    theme: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      date: args.date,
      title: args.title,
      scripture: args.scripture,
      reflection: args.reflection,
      prayer: args.prayer,
      theme: args.theme,
    });
    return ctx.db.get(args.id);
  },
});

export const ensureDailyDevotion: ReturnType<typeof internalAction> = internalAction({
  args: { date: v.optional(v.string()) },
  handler: async (ctx, args): Promise<DailyDevotionResult> => {
    const date = args.date ?? getUtcDateString();
    const allDevotions = await ctx.runQuery(internal.devotions.listDailyDevotionsForDedup, {});
    const existing = allDevotions.find((devotion) => devotion.date === date) ?? null;
    const otherSignatures = new Set(
      allDevotions
        .filter((devotion) => devotion.date !== date)
        .map((devotion) => buildDevotionSignature(devotion)),
    );

    if (existing && !otherSignatures.has(buildDevotionSignature(existing))) {
      return existing;
    }

    const avoid = seedAvoidLists(allDevotions.filter((devotion) => devotion.date !== date));

    for (let attempt = 1; attempt <= UNIQUE_ATTEMPTS; attempt++) {
      const generated = await runDevotionOrchestrator({ date, avoid, attempt });
      const signature = buildDevotionSignature(generated);
      if (!otherSignatures.has(signature)) {
        if (existing) {
          return ctx.runMutation(internal.devotions.replaceDailyDevotion, {
            id: existing._id,
            date: generated.date,
            title: generated.title,
            scripture: generated.scripture,
            reflection: generated.reflection,
            prayer: generated.prayer,
            theme: generated.theme,
          });
        }

        return ctx.runMutation(internal.devotions.upsertDailyDevotion, {
          date: generated.date,
          title: generated.title,
          scripture: generated.scripture,
          reflection: generated.reflection,
          prayer: generated.prayer,
          theme: generated.theme,
        });
      }

      otherSignatures.add(signature);
      addAvoid(avoid, generated);
    }

    throw new Error(
      `Unable to generate a unique devotion for ${date} after ${UNIQUE_ATTEMPTS} attempts.`,
    );
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
