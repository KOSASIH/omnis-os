// Pillar 1 — Reality Forge
// Text -> Plan. Parses a natural-language command into a structured build plan
// (BOM, budget, Gantt, legal checklist) using the OMNIS AI Core.

import { aiCore } from "../core/ai";
import { db } from "../core/db";

export interface ForgePlan {
  summary: string;
  bom: Array<{ item: string; qty: number; unitCost: number }>;
  budget: { currency: string; lines: Array<{ label: string; amount: number }>; total: number };
  gantt: Array<{ phase: string; startDay: number; durationDays: number }>;
  legalDocs: string[];
}

const FORGE_SYSTEM = `You are OMNIS Reality Forge. Convert a human intent into a
structured, buildable plan. Respond ONLY as JSON matching the ForgePlan interface:
{ summary, bom[], budget{}, gantt[], legalDocs[] }. Be concrete and realistic.`;

export async function forge(commandId: string, intent: string): Promise<ForgePlan> {
  const plan = await aiCore.json<ForgePlan>({
    system: FORGE_SYSTEM,
    user: intent,
  });

  await db.from("forge_plans").insert({
    command_id: commandId,
    summary: plan.summary,
    bom: plan.bom,
    budget: plan.budget,
    gantt: plan.gantt,
    legal_docs: plan.legalDocs,
  });

  await db.from("commands").update({ status: "forging" }).eq("id", commandId);
  return plan;
}
