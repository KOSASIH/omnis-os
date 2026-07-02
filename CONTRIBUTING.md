# Contributing to OMNIS

> Command Reality. AI Executes.

Thanks for building the JARVIS layer for reality. This guide keeps the codebase coherent as we ship the 5 Pillars.

## Ground rules

1. **Honesty over hype.** Every module is labeled `real` or `concept`. Never merge a stub that pretends to be functional. If a capability has no real public API (drones, Boston Dynamics, BCI, on-chain auto-compounding), it ships behind a clearly-flagged concept interface.
2. **Small, verifiable PRs.** One pillar concern per PR.
3. **Schema is source of truth.** `db/schema.sql` mirrors the live Postgres. Change the schema in a migration, never ad-hoc.

## Project structure

| Path | Pillar | Status |
|------|--------|--------|
| `src/pillars/reality-forge.ts` | 1 · Reality Forge | real (AI core) |
| `src/pillars/quantum-earth.ts` | 2 · Quantum Earth | real (Monte Carlo) |
| `src/pillars/the-oracle.ts` | 3 · The Oracle | real (search + AI) |
| `src/pillars/god-hands.ts` | 4 · God Hands IRL | real dispatcher, flagged stubs |
| `src/pillars/aether-vault.ts` | 5 · Aether Vault | concept (tokenomics) |

## Dev setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase + provider keys
npm run dev
```

## Commit style

Conventional commits: `feat:`, `fix:`, `docs:`, `ci:`, `refactor:`.

## License

MIT. Do whatever you want. Just build.
