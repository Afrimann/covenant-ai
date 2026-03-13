import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { groqChatCompletion, parseJsonResponse } from "../lib/groq";

export type VettingResult = {
  approved: boolean;
  issues: string[];
  finalTitle: string;
  finalReflection: string;
  finalPrayer: string;
};

function requireText(label: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Vetting agent response missing ${label}.`);
  }
  return trimmed;
}

function requireArray(label: string, value: string[] | undefined): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`Vetting agent response missing ${label}.`);
  }
  return value;
}

export async function runVettingAgent(args: {
  title: string;
  scripture: string;
  theme: string;
  reflection: string;
  prayer: string;
}): Promise<VettingResult> {
  const content = await groqChatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are the Theological Vetting Agent. Review the devotion for biblical accuracy, Christ-centered focus, and theological alignment. Identify any issues (e.g., prosperity theology, misquoted scripture, works-based salvation). If changes are needed, correct the title, reflection, and prayer. Respond with JSON only using keys: approved (boolean), issues (array of strings), finalTitle, finalReflection, finalPrayer. If no issues, set approved=true, issues=[], and keep final fields equal to the input.",
      },
      {
        role: "user",
        content: `Title: ${args.title}\nScripture: ${args.scripture}\nTheme: ${args.theme}\nReflection: ${args.reflection}\nPrayer: ${args.prayer}`,
      },
    ],
    temperature: 0.3,
    maxTokens: 500,
  });

  const result = parseJsonResponse<VettingResult>(content);
  return {
    approved: Boolean(result.approved),
    issues: requireArray("issues", result.issues),
    finalTitle: requireText("finalTitle", result.finalTitle),
    finalReflection: requireText("finalReflection", result.finalReflection),
    finalPrayer: requireText("finalPrayer", result.finalPrayer),
  };
}

export const vettingAgent = internalAction({
  args: {
    title: v.string(),
    scripture: v.string(),
    theme: v.string(),
    reflection: v.string(),
    prayer: v.string(),
  },
  handler: async (_ctx, args) => runVettingAgent(args),
});
