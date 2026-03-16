import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { groqChatCompletion, parseJsonResponse } from "../lib/groq";

export type ScriptureSelection = {
  title: string;
  scripture: string;
  theme: string;
};

export type ScriptureAvoidance = {
  scriptures?: string[];
  themes?: string[];
  titles?: string[];
};

export type ScriptureAgentInput = {
  date: string;
  avoid?: ScriptureAvoidance;
  attempt?: number;
};

function requireText(label: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Scripture agent response missing ${label}.`);
  }
  return trimmed;
}

function formatAvoidance(label: string, values: string[] | undefined): string | null {
  if (!values || values.length === 0) {
    return null;
  }
  return `${label}: ${values.join("; ")}`;
}

export async function runScriptureAgent(args: ScriptureAgentInput): Promise<ScriptureSelection> {
  const avoidLines = [
    formatAvoidance("Avoid scripture references", args.avoid?.scriptures),
    formatAvoidance("Avoid devotional titles", args.avoid?.titles),
    formatAvoidance("Avoid themes", args.avoid?.themes),
  ].filter((line): line is string => Boolean(line));

  const promptParts = [
    `Date: ${args.date}.`,
    args.attempt ? `Attempt: ${args.attempt}.` : null,
    "Ensure today's selection is distinct from previous devotions. Do not repeat any avoid items listed below.",
    avoidLines.length > 0 ? `Avoid list:\n${avoidLines.join("\n")}` : null,
    "Return JSON with keys: title, scripture, theme.",
  ].filter((part): part is string => Boolean(part));

  const baseTemperature = 0.4;
  const temperature =
    args.attempt && args.attempt > 1
      ? Math.min(0.9, baseTemperature + 0.15 * (args.attempt - 1))
      : baseTemperature;

  const content = await groqChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are the Scripture Selection Agent for a daily Christian devotion. Choose a single Bible passage reference (no verse text), a short theme, and a concise devotional title. Use canonical Bible books only. Avoid controversial or political topics. Respond with JSON only.",
      },
      {
        role: "user",
        content: promptParts.join("\n"),
      },
    ],
    temperature,
    maxTokens: 200,
  });

  const selection = parseJsonResponse<ScriptureSelection>(content);
  return {
    title: requireText("title", selection.title),
    scripture: requireText("scripture", selection.scripture),
    theme: requireText("theme", selection.theme),
  };
}

export const scriptureAgent = internalAction({
  args: {
    date: v.string(),
    avoid: v.optional(
      v.object({
        scriptures: v.optional(v.array(v.string())),
        themes: v.optional(v.array(v.string())),
        titles: v.optional(v.array(v.string())),
      }),
    ),
    attempt: v.optional(v.number()),
  },
  handler: async (_ctx, args) => runScriptureAgent(args),
});
