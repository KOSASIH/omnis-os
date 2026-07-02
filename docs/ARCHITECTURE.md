# OMNIS — System Architecture

> Command Reality. AI Executes.

OMNIS is a 5-pillar autonomous execution OS. This document maps the vision onto what is **actually built and running** vs. **honest concept stubs** (no real public API exists yet).

## Live Infrastructure

- **App shell:** Next.js on Vercel — `https://naive-omnis-7684af.vercel.app`
- **Backend:** Supabase (Postgres + Auth + Edge Functions)
- **AI Core:** LLM routing layer (GPT-4o / Claude) for intent -> structured plan

## The 5 Pillars

| # | Pillar | Function | Build Status |
|---|--------|----------|--------------|
| 1 | Reality Forge | Text -> Plan (BOM, budget, Gantt) | REAL — LLM + `forge_plans` table |
| 2 | Quantum Earth | Monte Carlo outcome simulation | REAL — Postgres edge function |
| 3 | The Oracle | Live market/legal/competitor intel | REAL — web search primitive |
| 4 | God Hands IRL | Execute via n8n webhooks | PARTIAL — webhook dispatcher real; drone/BCI = stub |
| 5 | Aether Vault DAO | On-chain treasury ($OMNIS) | STUB — tokenomics + wallet UI, no live token |

See `/db/schema.sql` for the production data model.
