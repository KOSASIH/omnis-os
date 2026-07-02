// Pillar 5 — Aether Vault DAO
// On-chain treasury for $OMNIS. Records fees, buyback, burn, and payouts.
// HONEST STATUS: no token is deployed. is_onchain=false until a real mint exists.
// This is a ledger + UI, NOT a running financial autopilot.

import { db } from "../core/db";

const BUYBACK_FEE_BPS = 200; // 2%

export async function recordFee(amount: number) {
  const buyback = (amount * BUYBACK_FEE_BPS) / 10_000;

  await db.from("treasury_ledger").insert([
    { entry_type: "fee", amount, is_onchain: false },
    { entry_type: "buyback", amount: buyback, is_onchain: false },
  ]);

  return { fee: amount, buybackAllocated: buyback, note: "CONCEPT: no live $OMNIS mint yet" };
}

export async function tokenStatus() {
  const { data } = await db.from("omnis_token").select("*").eq("id", 1).single();
  return data; // is_live=false until mint_address is set
}
