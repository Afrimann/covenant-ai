import type { TheologyResponse } from "./theologyAgent";

function formatList(items: string[], fallback: string) {
  if (!items || items.length === 0) {
    return fallback;
  }
  return items.map((item) => `- ${item}`).join("\n");
}

export function composeResponse(response: TheologyResponse): string {
  return [
    "Answer",
    response.answer.trim(),
    "",
    "Scripture References",
    formatList(response.scriptureReferences, "No scripture references provided."),
    "",
    "Explanation",
    response.explanation.trim(),
    "",
    "Supporting Theology",
    formatList(response.supportingTheology, "No supporting theological sources provided."),
    "",
    "Reflection",
    response.reflection.trim(),
  ].join("\n");
}
