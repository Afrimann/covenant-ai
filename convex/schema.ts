import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  dailyDevotions: defineTable({
    date: v.string(),
    title: v.string(),
    scripture: v.string(),
    reflection: v.string(),
    prayer: v.string(),
    theme: v.string(),
    createdAt: v.number(),
  }).index("by_date", ["date"]),
});

