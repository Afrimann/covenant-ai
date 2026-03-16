import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { embedTexts } from "../lib/embeddings";

export type RetrievedChunk = {
  id: string;
  title: string;
  source: string;
  chunk: string;
  score: number;
};

type RetrievalArgs = {
  query: string;
  limit?: number;
};

export async function runContextRetrievalAgent(
  ctx: { vectorSearch: any; runQuery: any },
  args: RetrievalArgs,
): Promise<RetrievedChunk[]> {
  const [embedding] = await embedTexts([args.query]);
  const results = await ctx.vectorSearch("documents", "by_embedding", {
    vector: embedding,
    limit: args.limit ?? 5,
  });

  if (results.length === 0) {
    return [];
  }

  const ids = results.map((result: { _id: string }) => result._id);
  const docs = await ctx.runQuery(internal.documents.getDocumentsByIds, { ids });
  const docsById = new Map(docs.map((doc: any) => [doc._id, doc]));

  return results
    .map((result: { _id: string; _score: number }) => {
      const doc = docsById.get(result._id);
      if (!doc) {
        return null;
      }
      return {
        id: result._id,
        // title: doc.title,
        // source: doc.source,
        // chunk: doc.chunk,
        score: result._score,
      } as RetrievedChunk;
    })
    .filter(Boolean) as RetrievedChunk[];
}

export const contextRetrievalAgent = internalAction({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => runContextRetrievalAgent(ctx, args),
});
