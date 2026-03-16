import { v } from "convex/values";
import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { runConversationAgent } from "./agents/conversationAgent";

const MAX_CONTEXT_MESSAGES = 6;
const MAX_TITLE_WORDS = 6;

export const listMessagesByChat = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

export const getRecentMessages = internalQuery({
  args: {
    chatId: v.id("chats"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? MAX_CONTEXT_MESSAGES;
    const results = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .take(limit);
    return results.reverse();
  },
});

export const insertMessage = internalMutation({
  args: {
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: args.role,
      content: args.content,
      createdAt: args.createdAt,
    });
    return ctx.db.get(id);
  },
});

function deriveTitle(content: string) {
  const words = content.trim().split(/\s+/).slice(0, MAX_TITLE_WORDS);
  const title = words.join(" ");
  return title.length > 0 ? title : "New Chat";
}

export const sendMessage = action({
  args: {
    chatId: v.id("chats"),
    userId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmed = args.content.trim();
    if (!trimmed) {
      throw new Error("Message content cannot be empty.");
    }

    const chat = await ctx.runQuery(internal.chats.getChatById, { chatId: args.chatId });
    if (!chat) {
      throw new Error("Chat not found.");
    }
    if (chat.userId !== args.userId) {
      throw new Error("Unauthorized.");
    }

    await ctx.runMutation(internal.messages.insertMessage, {
      chatId: args.chatId,
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    });

    const recentMessages = await ctx.runQuery(internal.messages.getRecentMessages, {
      chatId: args.chatId,
      limit: MAX_CONTEXT_MESSAGES,
    });

    const { response, sources } = await runConversationAgent(ctx, {
      question: trimmed,
      messages: recentMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    await ctx.runMutation(internal.messages.insertMessage, {
      chatId: args.chatId,
      role: "assistant",
      content: response,
      createdAt: Date.now(),
    });

    if (chat.title === "New Chat") {
      await ctx.runMutation(internal.chats.updateChatTitle, {
        chatId: args.chatId,
        title: deriveTitle(trimmed),
      });
    }

    return { response, sources };
  },
});
