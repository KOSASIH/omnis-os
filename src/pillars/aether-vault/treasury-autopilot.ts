/**
 * OMNIS — Pillar 5: Aether Vault
 * Treasury Autopilot — policy engine for auto-compound / buyback allocation.
 *
 * HONESTY FLAG: This is a PURE SIMULATION of an allocation policy. It moves
 * NO real money and signs NO transactions. It computes what a policy WOULD
 * do given inputs, so the numbers can be shown in the UI and every real
 * disbursement is gated behind human approval (requiresApproval()).
 */

import { OMNIS_TOKEN } from './omnis-token';

export interface TreasuryState {
  usdBalance: number;
  monthlyRevenueUsd: number;
}

export interface AllocationPolicy {
  buybackBurnPct: number;   // e.g. 0.20
  holderRewardsPct: number; // e.g. 0.30
  operationsPct: number;    // e.g. 0.30
  reservePct: number;       // e.g. 0.20
}

export const DEFAULT_POLICY: AllocationPolicy = {
  buybackBurnPct: OMNIS_TOKEN.buybackBurnFeeBps / 10_000 * 10, // 2% fee -> 20% of profit bucket
  holderRewardsPct: 0.3,
  operationsPct: 0.3,
  reservePct: 0.2,
};

/** Simulate one cycle. Returns intended allocations — does NOT execute them. */
export function simulateCycle(state: TreasuryState, policy: AllocationPolicy = DEFAULT_POLICY) {
  const distributable = Math.max(0, state.monthlyRevenueUsd);
  return {
    simulated: true as const,
    executed: false as const,
    buybackBurnUsd: distributable * policy.buybackBurnPct,
    holderRewardsUsd: distributable * policy.holderRewardsPct,
    operationsUsd: distributable * policy.operationsPct,
    reserveUsd: distributable * policy.reservePct,
    note: 'Simulation only. Real disbursement requires human approval and a live signer.',
  };
}
