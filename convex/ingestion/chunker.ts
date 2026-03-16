export type ChunkingOptions = {
  wordsPerChunk?: number;
  overlapWords?: number;
};

export function chunkText(text: string, options: ChunkingOptions = {}): string[] {
  const wordsPerChunk = options.wordsPerChunk ?? 800;
  const overlapWords = options.overlapWords ?? 100;

  const words = text
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + wordsPerChunk, words.length);
    chunks.push(words.slice(start, end).join(" "));
    if (end === words.length) {
      break;
    }
    start = Math.max(0, end - overlapWords);
  }

  return chunks;
}
