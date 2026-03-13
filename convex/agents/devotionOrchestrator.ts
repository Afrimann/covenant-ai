import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { runPrayerAgent } from "./prayerAgent";
import { runReflectionAgent } from "./reflectionAgent";
import { runScriptureAgent } from "./scriptureAgent";
import { runVettingAgent } from "./vettingAgent";

export type OrchestratedDevotion = {
  date: string;
  title: string;
  scripture: string;
  reflection: string;
  prayer: string;
  theme: string;
};

export async function runDevotionOrchestrator(args: { date: string }): Promise<OrchestratedDevotion> {
  const scriptureSelection = await runScriptureAgent({ date: args.date });
  const reflection = await runReflectionAgent({
    title: scriptureSelection.title,
    scripture: scriptureSelection.scripture,
    theme: scriptureSelection.theme,
  });
  const prayer = await runPrayerAgent({
    scripture: scriptureSelection.scripture,
    theme: scriptureSelection.theme,
    reflection,
  });
  const vetting = await runVettingAgent({
    title: scriptureSelection.title,
    scripture: scriptureSelection.scripture,
    theme: scriptureSelection.theme,
    reflection,
    prayer,
  });

  return {
    date: args.date,
    title: vetting.finalTitle,
    scripture: scriptureSelection.scripture,
    reflection: vetting.finalReflection,
    prayer: vetting.finalPrayer,
    theme: scriptureSelection.theme,
  };
}

export const devotionOrchestrator = internalAction({
  args: { date: v.string() },
  handler: async (_ctx, args) => runDevotionOrchestrator(args),
});
