import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { groqChatCompletion, parseJsonResponse } from "../lib/groq";

export type ScriptureSelection = {
  title: string;
  scripture: string;
  theme: string;
};

function requireText(label: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Scripture agent response missing ${label}.`);
  }
  return trimmed;
}

export async function runScriptureAgent(args: { date: string }): Promise<ScriptureSelection> {
  const content = await groqChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are the Scripture Selection Agent for a daily Christian devotion. Choose a single Bible passage reference (no verse text), a short theme, and a concise devotional title. Use canonical Bible books only. Avoid controversial or political topics. Respond with JSON only.",
      },
      {
        role: "user",
        content: `Date: ${args.date}. Return JSON with keys: title, scripture, theme.`,
      },
    ],
    temperature: 0.4,
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
  args: { date: v.string() },
  handler: async (_ctx, args) => runScriptureAgent(args),
});
