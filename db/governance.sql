-- OMNIS — Phase 3/4 schema extension
-- Governance tables for Aether Vault DAO + Prime capability registry.

create table if not exists dao_proposals (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  target        text not null,            -- which God Hands integration this funds
  status        text not null default 'open',  -- open | passed | rejected | executed
  created_at    timestamptz not null default now()
);

create table if not exists dao_votes (
  id            uuid primary key default gen_random_uuid(),
  proposal_id   uuid not null references dao_proposals(id) on delete cascade,
  voter_wallet  text not null,
  omnis_weight  numeric not null default 0,     -- $OMNIS-weighted vote
  choice        text not null,                   -- for | against | abstain
  created_at    timestamptz not null default now(),
  unique (proposal_id, voter_wallet)
);

-- Phase-4 capability registry: every Prime slot is recorded as a concept
-- until a real API is wired. is_live stays false; no action is ever faked.
create table if not exists prime_capabilities (
  id            uuid primary key default gen_random_uuid(),
  capability    text not null unique,            -- e.g. robotics.dispatchTask
  is_live       boolean not null default false,
  note          text
);

insert into prime_capabilities (capability, note) values
  ('bci.readIntent',        'No real public consumer BCI command API yet.'),
  ('robotics.dispatchTask', 'No real public Boston Dynamics fleet API yet.'),
  ('construction.breakGround','No real autonomous construction API yet.')
on conflict (capability) do nothing;
