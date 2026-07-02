// Pillar 3 — The Oracle
// Cognition layer. Pulls real-time market, legal, and competitor intel via the
// OMNIS search primitive and distills it with the AI Core. BCI input = future stub.

import { webSearch } from "../core/search";
import { aiCore } from "../core/ai";
import { db } from "../core/db";

type Kind = "market" | "legal" | "competitor";

export async function consultOracle(commandId: string, topic: string, kind: Kind) {
  const hits = await webSearch(`${kind} analysis: ${topic}`, { depth: "advanced" });

  const summary = await aiCore.text({
    system: `You are OMNIS Oracle. Summarize the ${kind} landscape for a builder in <=6 crisp bullets. Cite sources inline.`,
    user: JSON.stringify(hits.slice(0, 8)),
  });

  const row = {
    command_id: commandId,
    kind,
    sources: hits.map((h) => ({ title: h.title, url: h.url })),
    summary,
    confidence: Math.min(1, hits.length / 8),
  };
  await db.from("oracle_insights").insert(row);
  return row;
}
