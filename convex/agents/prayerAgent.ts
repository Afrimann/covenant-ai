import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { groqChatCompletion } from "../lib/groq";

function requireText(label: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Prayer agent response missing ${label}.`);
  }
  return trimmed;
}

export async function runPrayerAgent(args: {
  scripture: string;
  theme: string;
  reflection: string;
}): Promise<string> {
  const content = await groqChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are the Prayer Composition Agent. Write a heartfelt prayer that responds to the scripture and theme. Keep it biblically grounded and humble. Aim for 80-120 words. Return plain text only.",
      },
      {
        role: "user",
        content: `Scripture: ${args.scripture}\nTheme: ${args.theme}\nReflection: ${args.reflection}\n\nCompose the prayer.`,
      },
    ],
    temperature: 0.5,
    maxTokens: 240,
  });

  return requireText("prayer", content);
}

export const prayerAgent = internalAction({
  args: {
    scripture: v.string(),
    theme: v.string(),
    reflection: v.string(),
  },
  handler: async (_ctx, args) => runPrayerAgent(args),
});
