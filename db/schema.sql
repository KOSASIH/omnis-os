-- OMNIS — The Autonomous World Operating System
-- Production Postgres schema (Supabase). Mirrors the live DB.
-- 7 core tables mapping the 5 Pillars.

-- Pillar 0: Intent input
create table if not exists commands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  raw_intent text not null,          -- e.g. omnis launch "D2C Skincare Brand"
  verb text,                          -- launch | build | deploy
  status text default 'received',     -- received | forging | simulated | executing | done
  created_at timestamptz default now()
);

-- Pillar 1: Reality Forge (Text -> Plan)
create table if not exists forge_plans (
  id uuid primary key default gen_random_uuid(),
  command_id uuid references commands(id) on delete cascade,
  summary text,
  bom jsonb,                          -- bill of materials
  budget jsonb,                       -- line-item budget
  gantt jsonb,                        -- timeline / milestones
  legal_docs jsonb,                   -- required filings / checklist
  model_3d_url text,
  created_at timestamptz default now()
);

-- Pillar 2: Quantum Earth (Monte Carlo simulation)
create table if not exists simulations (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references forge_plans(id) on delete cascade,
  iterations int default 10000,
  cost_p50 numeric, cost_p90 numeric,
  time_p50 numeric, time_p90 numeric,
  roi_mean numeric, risk_score numeric,
  distribution jsonb,
  created_at timestamptz default now()
);

-- Pillar 3: The Oracle (cognition / live intel)
create table if not exists oracle_insights (
  id uuid primary key default gen_random_uuid(),
  command_id uuid references commands(id) on delete cascade,
  kind text,                          -- market | legal | competitor
  sources jsonb,
  summary text,
  confidence numeric,
  created_at timestamptz default now()
);

-- Pillar 4: God Hands IRL (execution)
create table if not exists executions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references forge_plans(id) on delete cascade,
  channel text,                       -- n8n | email | social | phone | drone(stub) | robot(stub)
  webhook_url text,
  payload jsonb,
  status text default 'queued',       -- queued | dispatched | ack | failed
  is_stub boolean default false,      -- honest flag for non-functional real-world actuators
  created_at timestamptz default now()
);

-- Pillar 5: Aether Vault DAO (treasury)
create table if not exists treasury_ledger (
  id uuid primary key default gen_random_uuid(),
  entry_type text,                    -- fee | buyback | burn | payout
  amount numeric,
  token text default 'OMNIS',
  tx_sig text,                        -- Solana signature (null while concept)
  is_onchain boolean default false,
  created_at timestamptz default now()
);

create table if not exists omnis_token (
  id int primary key default 1,
  symbol text default 'OMNIS',
  chain text default 'solana',
  total_supply numeric default 1000000000,
  buyback_fee_bps int default 200,    -- 2%
  is_live boolean default false,      -- honest: no token deployed
  mint_address text
);
