/**
 * OMNIS — The Autonomous World Operating System
 * Unified boot layer. Wires all 5 pillars behind a single command spine.
 *
 * Real vs. concept flagging is preserved end-to-end (see per-pillar modules).
 */

import { realityForge } from './pillars/reality-forge'
import { quantumEarth } from './pillars/quantum-earth'
import { theOracle } from './pillars/the-oracle'
import { dispatch } from './pillars/god-hands/dispatcher'
import { aetherVault } from './pillars/aether-vault/omnis-token'

export interface OmnisConfig {
  supabaseUrl: string
  supabaseKey: string
  aiEnabled: boolean      // true once a Naive plan unlocks the LLM core
  executionEnabled: boolean
}

export interface CommandResult {
  command: string
  stages: Record<string, unknown>
  status: 'ok' | 'partial' | 'blocked'
}

/**
 * The OS spine: intent -> Forge -> Quantum -> Oracle -> God Hands -> Vault.
 * Each stage degrades honestly: if the AI core is not unlocked, that stage
 * returns { status: 'pending_ai' } rather than fabricating output.
 */
export async function omnis(intent: string, cfg: OmnisConfig): Promise<CommandResult> {
  const stages: Record<string, unknown> = {}

  stages.forge = await realityForge(intent, { aiEnabled: cfg.aiEnabled })
  stages.quantum = await quantumEarth((stages.forge as any)?.plan ?? null)
  stages.oracle = await theOracle(intent, { aiEnabled: cfg.aiEnabled })
  stages.execution = cfg.executionEnabled
    ? await dispatch((stages.forge as any)?.actions ?? [])
    : { status: 'disabled', reason: 'executionEnabled=false' }
  stages.vault = aetherVault.status()

  const blocked = Object.values(stages).some(
    (s: any) => s?.status === 'pending_ai' || s?.status === 'blocked',
  )

  return { command: intent, stages, status: blocked ? 'partial' : 'ok' }
}

export const PILLARS = ['reality-forge', 'quantum-earth', 'the-oracle', 'god-hands', 'aether-vault'] as const
