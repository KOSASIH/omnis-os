# $OMNIS Tokenomics

> A Solana SPL token. **Status: CONCEPT — not deployed.** The `omnis_token` row in the
> production DB carries `is_live = false` so nothing in the app fakes a live token.

## Supply
- **Total supply:** 1,000,000,000 $OMNIS
- **Chain:** Solana (SPL)
- **Model:** Deflationary

## Utility
1. Pay for Forge / Simulate credits.
2. Stake to unlock **God Hands IRL** execution.

## Value Accrual
- **2%** (200 bps) of all platform fees -> automatic buyback + burn.
- Recorded in `treasury_ledger` (`entry_type` = fee | buyback | burn | payout).

## Governance
- Holders vote on which **God Hands** integrations to build next.

## Honest Boundaries
The "self-managing, auto-compounding on-chain treasury" is presented as a wallet UI +
tokenomics page with a live/concept flag. It is **not** a running financial autopilot.
When/if a mint is deployed, set `mint_address` and flip `is_live = true`.
