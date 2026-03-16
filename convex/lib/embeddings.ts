const EMBEDDINGS_BASE_URL =
  process.env.EMBEDDINGS_BASE_URL ?? "https://api.cohere.ai/v2/embed";

const EMBEDDINGS_MODEL = "embed-english-v3.0";

const EMBEDDING_API_KEY =
  process.env.EMBEDDING_API_KEY

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getEmbeddingsApiKey(): string {
  return requireEnv("EMBEDDING_API_KEY", EMBEDDING_API_KEY);
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const response = await fetch(EMBEDDINGS_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getEmbeddingsApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDINGS_MODEL,
      texts: texts,
      input_type: "search_document",
      embedding_types: ["float"],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embeddings API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as {
    embeddings?: {
      float?: number[][];
    };
  };

  const embeddings = data.embeddings?.float;

  if (!embeddings || embeddings.length !== texts.length) {
    throw new Error("Embeddings API response missing embeddings.");
  }

  return embeddings;
}

