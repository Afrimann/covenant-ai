import { embedTexts } from "../lib/embeddings";

const DEFAULT_BATCH_SIZE = 16;

export async function embedChunks(chunks: string[], batchSize = DEFAULT_BATCH_SIZE) {
  const embeddings: number[][] = [];
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const batchEmbeddings = await embedTexts(batch);
    embeddings.push(...batchEmbeddings);
  }
  return embeddings;
}
