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
  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId", "createdAt"]),
  messages: defineTable({
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_chat", ["chatId", "createdAt"]),
  documents: defineTable({
    title: v.string(),
    source: v.string(),
    chunk: v.string(),
    embedding: v.array(v.number()),
    createdAt: v.number(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1024,
    filterFields: ["source", "title"],
  }),
  pushSubscriptions: defineTable({
    userId: v.string(),
    endpoint: v.string(),
    keys: v.object({
      p256dh: v.string(),
      auth: v.string(),
    }),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_endpoint", ["endpoint"]),
});
