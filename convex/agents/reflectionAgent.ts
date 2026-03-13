import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { groqChatCompletion } from "../lib/groq";

function requireText(label: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Reflection agent response missing ${label}.`);
  }
  return trimmed;
}

export async function runReflectionAgent(args: {
  title: string;
  scripture: string;
  theme: string;
}): Promise<string> {
  const content = await groqChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are the Reflection Writing Agent. Write a devotional reflection rooted in the given scripture and theme. Keep it Christ-centered, theologically orthodox, and practical. Aim for 120-170 words. Do not use bullet points or headings. Return plain text only.",
      },
      {
        role: "user",
        content: `Title: ${args.title}\nScripture: ${args.scripture}\nTheme: ${args.theme}\n\nWrite the reflection.`,
      },
    ],
    temperature: 0.6,
    maxTokens: 420,
  });

  return requireText("reflection", content);
}

export const reflectionAgent = internalAction({
  args: {
    title: v.string(),
    scripture: v.string(),
    theme: v.string(),
  },
  handler: async (_ctx, args) => runReflectionAgent(args),
});
