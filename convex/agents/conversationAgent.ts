import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { runContextRetrievalAgent } from "./retrievalAgent";
import { runTheologyReasoningAgent } from "./theologyAgent";
import { runScriptureVerificationAgent } from "./verificationAgent";
import { composeResponse } from "./composerAgent";

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type ConversationArgs = {
  question: string;
  messages: ConversationMessage[];
};

export async function runConversationAgent(
  ctx: { vectorSearch: any; runQuery: any },
  args: ConversationArgs,
) {
  const sources = await runContextRetrievalAgent(ctx, { query: args.question, limit: 5 });
  const draft = await runTheologyReasoningAgent({
    question: args.question,
    messages: args.messages,
    sources,
  });

  let finalDraft = draft;
  try {
    const verification = await runScriptureVerificationAgent({ draft, sources });
    finalDraft = verification.final;
  } catch {
    finalDraft = draft;
  }

  const response = composeResponse(finalDraft);
  return { response, sources };
}

export const conversationAgent = internalAction({
  args: {
    question: v.string(),
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => runConversationAgent(ctx, args),
});
