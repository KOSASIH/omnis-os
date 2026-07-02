<h1 align="center">OMNIS</h1>
<p align="center"><b>The Autonomous World Operating System</b><br/>
<i>Command Reality. AI Executes.</i></p>

<p align="center">
<a href="https://naive-omnis-7684af.vercel.app">Live App</a> ·
<a href="./docs/ARCHITECTURE.md">Architecture</a> ·
<a href="./docs/TOKENOMICS.md">Tokenomics</a> ·
<a href="./docs/ROADMAP.md">Roadmap</a>
</p>

---

## Vision
The JARVIS layer for reality. You don't manage tasks, teams, or tools — you command; OMNIS handles the rest. **1 Human, 1 OS, Infinite Execution.**

## The 5 Pillars

| # | Pillar | Function | IRL Analogy | Status |
|---|--------|----------|-------------|--------|
| 1 | **Reality Forge** | Text → Plan (3D, BOM, budget, legal, Gantt) | AI Architect + PM + Lawyer | ✅ Real (LLM + `forge_plans`) |
| 2 | **Quantum Earth** | 10,000-run Monte Carlo (cost/time/risk/ROI) | AI McKinsey | ✅ Real (in-repo math) |
| 3 | **The Oracle** | Live market/legal/competitor intel | AI Chief of Staff | ✅ Real (web search) |
| 4 | **God Hands IRL** | Execute via n8n webhooks + real channels | AI COO | ⚠️ Dispatcher real; drone/robot/BCI = honest stub |
| 5 | **Aether Vault DAO** | $OMNIS on-chain treasury | AI CFO | ⚠️ Ledger + UI; no live token (`is_live=false`) |

## Tech Stack
**Frontend:** Next.js 14 (App Router), React, TypeScript, TailwindCSS, shadcn/ui, Framer Motion
**3D & Viz:** @react-three/fiber, Three.js, Mermaid.js, Recharts
**AI Core:** GPT-4o / Claude, LangChain, Vector RAG
**Web3:** Solana, wallet-adapter, Helius RPC, Anchor ($OMNIS)
**Execution:** n8n webhooks, Node workers, Puppeteer
**Infra:** Vercel, Supabase/Postgres, Upstash Redis

## What is actually live right now
- **App shell:** https://naive-omnis-7684af.vercel.app (Next.js on Vercel)
- **Backend:** Supabase Postgres with the full 7-table 5-pillar schema (`db/schema.sql`)
- **$OMNIS record:** 1,000,000,000 supply, 2% buyback fee, `is_live = false`
- **Pillar modules:** scaffolded in `src/pillars/`

## Honest boundaries
We do **not** fake capability. Autonomous drones, Boston Dynamics control, and BCI input have no real public API today — they ship as clearly-labeled concept interfaces (`is_stub = true`). The "self-managing auto-compounding treasury" is a ledger + wallet UI, not a running financial autopilot.

## Quick start
```bash
git clone https://github.com/KOSASIH/omnis-os.git
cd omnis-os
cp .env.example .env.local   # fill in keys
# apply db/schema.sql to your Supabase project
```

## Usage (target UX)
```bash
> omnis launch "D2C Skincare Brand"
> omnis build  "Airbnb in Ubud"
> omnis deploy "Community Center"
```

## License
MIT — do whatever you want. Just build.

<p align="center"><i>AETHERION LABS — Command Reality. AI Executes.</i></p>
