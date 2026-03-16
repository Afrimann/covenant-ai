import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";

export const createChat = mutation({
  args: {
    userId: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chats", {
      userId: args.userId,
      title: args.title?.trim() || "New Chat",
      createdAt: Date.now(),
    });
    return ctx.db.get(id);
  },
});

export const listChatsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getChatById = internalQuery({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.chatId);
  },
});

export const updateChatTitle = internalMutation({
  args: {
    chatId: v.id("chats"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chatId, { title: args.title });
    return ctx.db.get(args.chatId);
  },
});
