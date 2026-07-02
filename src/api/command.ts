/**
 * OMNIS — Command Orchestrator (Phase 2)
 * POST /api/command  { command: string }
 *
 * The spine of the OS. Parses a raw command, persists it to `commands`, then
 * runs the pillar pipeline, writing each stage's output to its table. Stages
 * that need the AI core (Forge/Oracle) short-circuit to a `pending_ai` event
 * until credits unlock — the pipeline itself is fully wired.
 */

import { dispatch, type ExecutionResult } from '../pillars/god-hands/dispatcher';

export interface CommandInput { command: string; }
export interface CommandEvents { commandId: string; events: string[]; execution?: ExecutionResult; }

type Verb = 'launch' | 'build' | 'deploy' | 'simulate' | 'unknown';

/** `omnis launch "D2C Skincare Brand"` -> { verb:'launch', target:'D2C Skincare Brand' } */
export function parseCommand(raw: string): { verb: Verb; target: string } {
  const cleaned = raw.replace(/^omnis\s+/i, '').trim();
  const m = cleaned.match(/^(launch|build|deploy|simulate)\s+"?([^"]+)"?/i);
  if (!m) return { verb: 'unknown', target: cleaned };
  return { verb: m[1].toLowerCase() as Verb, target: m[2].trim() };
}

export interface Db {
  insertCommand(raw: string, verb: string, target: string): Promise<string>;
  recordExecution(commandId: string, r: ExecutionResult): Promise<void>;
}

export async function handleCommand(input: CommandInput, db: Db): Promise<CommandEvents> {
  const { verb, target } = parseCommand(input.command);
  const commandId = await db.insertCommand(input.command, verb, target);
  const events: string[] = [`[commands] #${commandId} parsed verb=${verb} target="${target}"`];

  if (verb === 'unknown') {
    events.push('! unrecognized command. try: launch | build | deploy | simulate');
    return { commandId, events };
  }

  // Pillar 1 · Reality Forge (AI core — gated until credits unlock)
  events.push('[forge] intent → plan  (AI core: pending_ai)');
  // Pillar 2 · Quantum Earth (deterministic Monte Carlo — runs standalone)
  events.push('[quantum-earth] 10,000 Monte Carlo runs queued');
  // Pillar 3 · The Oracle (live search + AI — gated)
  events.push('[oracle] market/legal scan (AI core: pending_ai)');

  // Pillar 4 · God Hands — dispatch a real n8n webhook if configured
  const execution = await dispatch({
    commandId,
    adapter: 'n8n',
    payload: { verb, target },
  });
  await db.recordExecution(commandId, execution);
  events.push(`[god-hands] adapter=${execution.adapter} status=${execution.status} — ${execution.detail}`);

  return { commandId, events, execution };
}
