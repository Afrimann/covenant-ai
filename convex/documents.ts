import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";

export const listDocuments = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("documents").collect();
  },
});

export const getDocumentsByIds = internalQuery({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, args) => {
    const docs = await Promise.all(args.ids.map((id) => ctx.db.get(id)));
    return docs.filter(Boolean);
  },
});

export const insertDocumentChunk = internalMutation({
  args: {
    title: v.string(),
    source: v.string(),
    chunk: v.string(),
    embedding: v.array(v.number()),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("documents", {
      title: args.title,
      source: args.source,
      chunk: args.chunk,
      embedding: args.embedding,
      createdAt: args.createdAt,
    });
    return ctx.db.get(id);
  },
});
