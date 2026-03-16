"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { chunkText } from "./ingestion/chunker";
import { embedChunks } from "./ingestion/embedder";
import { extractTextFromPdf } from "./ingestion/pdfParser";

const DEFAULT_WORDS_PER_CHUNK = 800;
const DEFAULT_OVERLAP_WORDS = 100;

async function storeChunks(
  ctx: ActionCtx,
  args: { title: string; source: string; chunks: string[] },
) {
  if (args.chunks.length === 0) {
    return { chunksStored: 0 };
  }
  const embeddings = await embedChunks(args.chunks);
  const createdAt = Date.now();
  for (let i = 0; i < args.chunks.length; i++) {
    await ctx.runMutation(internal.documents.insertDocumentChunk, {
      title: args.title,
      source: args.source,
      chunk: args.chunks[i],
      embedding: embeddings[i],
      createdAt,
    });
  }
  return { chunksStored: args.chunks.length };
}

export const generateUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    return ctx.storage.generateUploadUrl();
  },
});

export const ingestTextDocument = action({
  args: {
    title: v.string(),
    source: v.string(),
    text: v.string(),
    wordsPerChunk: v.optional(v.number()),
    overlapWords: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const chunks = chunkText(args.text, {
      wordsPerChunk: args.wordsPerChunk ?? DEFAULT_WORDS_PER_CHUNK,
      overlapWords: args.overlapWords ?? DEFAULT_OVERLAP_WORDS,
    });
    return storeChunks(ctx, { title: args.title, source: args.source, chunks });
  },
});

export const ingestPdfDocument = action({
  args: {
    title: v.string(),
    source: v.string(),
    storageId: v.id("_storage"),
    wordsPerChunk: v.optional(v.number()),
    overlapWords: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const blob = await ctx.storage.get(args.storageId);
    if (!blob) {
      throw new Error("PDF not found in storage.");
    }
    const buffer = Buffer.from(await blob.arrayBuffer());
    const text = await extractTextFromPdf(buffer);
    if (!text) {
      throw new Error("PDF extraction returned empty text.");
    }
    const chunks = chunkText(text, {
      wordsPerChunk: args.wordsPerChunk ?? DEFAULT_WORDS_PER_CHUNK,
      overlapWords: args.overlapWords ?? DEFAULT_OVERLAP_WORDS,
    });
    return storeChunks(ctx, { title: args.title, source: args.source, chunks });
  },
});
