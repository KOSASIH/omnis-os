# OMNIS Changelog

All notable changes to the Autonomous World Operating System.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]
### Added
- Live Supabase data layer (`src/lib/supabase.ts`) + typed repository (`src/lib/repository.ts`)
  wiring the OS spine to the 7-table Postgres backend.

## Phase 4 — OMNIS Prime (concept scaffold)
### Added
- `src/omnis.ts` — OS spine booting all 5 pillars in sequence.
- `src/ui/landing.tsx` — unified terminal + vault surface.
- `src/pillars/omnis-prime/interfaces.ts` — BCI / robotics / construction adapters (`not_implemented`).
- `db/governance.sql` — DAO proposal/vote tables + prime capability registry.
- `tests/pillars.test.ts` — honesty-contract tests (concept modules can never report success).

## Phase 3 — Aether Vault
### Added
- `$OMNIS` SPL token spec + guarded client (`IS_LIVE=false`).
- DAO governance with $OMNIS-weighted tally.
- Treasury autopilot (simulation only) + concept-flagged vault UI.

## Phase 2 — God Hands
### Added
- Execution dispatcher with live n8n + HTTP adapters (drone/robotics flagged `not_implemented`).
- Upwork hire adapter (real, activates on `UPWORK_API_TOKEN`).
- Command orchestrator route + terminal UI.

## Phase 1 — Awakening
### Added
- App shell on Vercel + Supabase.
- 7-table 5-pillar schema; `$OMNIS` tokenomics seeded (1B, 2% fee, `is_live=false`).
- README, ARCHITECTURE, TOKENOMICS, ROADMAP; CI + CONTRIBUTING.
