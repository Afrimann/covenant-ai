import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { groqChatCompletion, parseJsonResponse } from "../lib/groq";
import type { RetrievedChunk } from "./retrievalAgent";
import type { TheologyResponse } from "./theologyAgent";

export type VerificationResult = {
  approved: boolean;
  issues: string[];
  final: TheologyResponse;
};

type VerificationArgs = {
  draft: TheologyResponse;
  sources: RetrievedChunk[];
};

function normalizeArray(label: string, value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  throw new Error(`Verification response missing ${label}.`);
}

function requireObject(label: string, value: TheologyResponse | undefined): TheologyResponse {
  if (!value) {
    throw new Error(`Verification response missing ${label}.`);
  }
  return value;
}

export async function runScriptureVerificationAgent(
  args: VerificationArgs,
): Promise<VerificationResult> {
  const content = await groqChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are the Scripture Verification Agent. Verify scripture references are accurate and theology aligns with orthodox Christian doctrine. Correct any issues. Respond with JSON only using keys: approved (boolean), issues (array), final (object matching the draft structure).",
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            draft: args.draft,
            sources: args.sources.map((source) => ({
              title: source.title,
              source: source.source,
              chunk: source.chunk,
            })),
          },
          null,
          2,
        ),
      },
    ],
    temperature: 0.2,
    maxTokens: 700,
  });

  const result = parseJsonResponse<VerificationResult>(content);
  return {
    approved: Boolean(result.approved),
    issues: normalizeArray("issues", result.issues),
    final: requireObject("final", result.final),
  };
}

export const scriptureVerificationAgent = internalAction({
  args: {
    draft: v.object({
      answer: v.string(),
      scriptureReferences: v.array(v.string()),
      explanation: v.string(),
      supportingTheology: v.array(v.string()),
      reflection: v.string(),
    }),
    sources: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        source: v.string(),
        chunk: v.string(),
        score: v.number(),
      }),
    ),
  },
  handler: async (_ctx, args) => runScriptureVerificationAgent(args),
});
