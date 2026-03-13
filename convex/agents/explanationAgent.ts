import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { groqChatCompletion } from "../lib/groq";

export type ExplanationFocus = "scripture" | "devotion";

function requireText(label: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Explanation agent response missing ${label}.`);
  }
  return trimmed;
}

export async function runExplanationAgent(args: {
  title: string;
  scripture: string;
  theme: string;
  reflection: string;
  focus: ExplanationFocus;
}): Promise<string> {
  const focusPrompt =
    args.focus === "devotion"
      ? "Explain the devotional reflection in clear, encouraging language. Highlight the core spiritual takeaway and a practical next step."
      : "Explain the scripture reference in context (historical or literary if helpful), summarize its meaning, and connect it to the theme.";

  const content = await groqChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are the Explanation Agent. Provide a concise, theologically sound explanation for a Christian audience. Avoid controversy or denominational disputes. Use 2-3 short paragraphs, 120-160 words total. Return plain text only.",
      },
      {
        role: "user",
        content: `Title: ${args.title}\nScripture: ${args.scripture}\nTheme: ${args.theme}\nReflection: ${args.reflection}\n\nFocus: ${focusPrompt}`,
      },
    ],
    temperature: 0.5,
    maxTokens: 360,
  });

  return requireText("explanation", content);
}

export const explanationAgent = internalAction({
  args: {
    title: v.string(),
    scripture: v.string(),
    theme: v.string(),
    reflection: v.string(),
    focus: v.union(v.literal("scripture"), v.literal("devotion")),
  },
  handler: async (_ctx, args) => runExplanationAgent(args),
});
