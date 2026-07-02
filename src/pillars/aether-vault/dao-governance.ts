/**
 * OMNIS — Pillar 5: Aether Vault
 * DAO Governance: proposals + $OMNIS-weighted voting.
 *
 * HONESTY FLAG: Off-chain governance model. Votes are recorded in the
 * `treasury_ledger`/governance tables (Postgres), NOT on-chain. When a real
 * $OMNIS mint + Realms/SPL-governance program exist, tally() can be swapped
 * for an on-chain snapshot read. No autonomous treasury movement occurs here.
 */

export type ProposalStatus = 'draft' | 'active' | 'passed' | 'rejected' | 'executed';

export interface Proposal {
  id: string;
  title: string;
  body: string;
  // Governs which 'God Hands' integration to build next (per spec)
  choices: string[];
  status: ProposalStatus;
  createdAt: string;
}

export interface Vote {
  proposalId: string;
  voter: string;      // wallet or user id
  choice: string;
  weight: number;     // $OMNIS balance snapshot (off-chain until live)
}

export function tally(proposal: Proposal, votes: Vote[]) {
  const totals: Record<string, number> = Object.fromEntries(proposal.choices.map((c) => [c, 0]));
  for (const v of votes) {
    if (v.choice in totals) totals[v.choice] += Math.max(0, v.weight);
  }
  const winner = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const totalWeight = Object.values(totals).reduce((a, b) => a + b, 0);
  return { totals, winner, totalWeight, onChain: false as const };
}

/** Guard: execution of a passed proposal routes through the approval gate, never auto-fires. */
export function requiresApproval(_p: Proposal): boolean {
  return true;
}
