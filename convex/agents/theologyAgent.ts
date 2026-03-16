import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { groqChatCompletion, parseJsonResponse } from "../lib/groq";
import type { RetrievedChunk } from "./retrievalAgent";

export type TheologyResponse = {
  answer: string;
  scriptureReferences: string[];
  explanation: string;
  supportingTheology: string[];
  reflection: string;
};

type TheologyArgs = {
  question: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  sources: RetrievedChunk[];
};

function requireText(label: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Theology agent response missing ${label}.`);
  }
  return trimmed;
}

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
  throw new Error(`Theology agent response missing ${label}.`);
}

function buildHistory(messages: TheologyArgs["messages"]) {
  if (messages.length === 0) {
    return "No prior conversation.";
  }
  return messages
    .map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`)
    .join("\n");
}

function buildSources(sources: RetrievedChunk[]) {
  if (sources.length === 0) {
    return "No retrieved sources available.";
  }
  return sources
    .map(
      (source, index) =>
        `Source ${index + 1} (${source.title} — ${source.source}):\n${source.chunk}`,
    )
    .join("\n\n");
}

export async function runTheologyReasoningAgent(args: TheologyArgs): Promise<TheologyResponse> {
  const content = await groqChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are the Theology Reasoning Agent for a Christian research assistant. Scripture is the highest authority. Use retrieved sources only as supporting material. Avoid speculation or claims not grounded in sources. If sources are insufficient, say so clearly. Return JSON only with keys: answer, scriptureReferences (array), explanation, supportingTheology (array), reflection.",
      },
      {
        role: "user",
        content: [
          `Question: ${args.question}`,
          "Conversation history:",
          buildHistory(args.messages),
          "Retrieved sources:",
          buildSources(args.sources),
          "Respond with JSON only.",
        ].join("\n"),
      },
    ],
    temperature: 0.4,
    maxTokens: 900,
  });

  const response = parseJsonResponse<TheologyResponse>(content);
  return {
    answer: requireText("answer", response.answer),
    scriptureReferences: normalizeArray("scriptureReferences", response.scriptureReferences),
    explanation: requireText("explanation", response.explanation),
    supportingTheology: normalizeArray("supportingTheology", response.supportingTheology),
    reflection: requireText("reflection", response.reflection),
  };
}

export const theologyReasoningAgent = internalAction({
  args: {
    question: v.string(),
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
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
  handler: async (_ctx, args) => runTheologyReasoningAgent(args),
});
