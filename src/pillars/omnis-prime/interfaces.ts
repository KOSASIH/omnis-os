/**
 * Phase 4 — OMNIS PRIME (BCI input, Boston Dynamics, autonomous construction).
 *
 * HONESTY CONTRACT: There is NO real public API for consumer BCI command input,
 * Boston Dynamics fleet control, or autonomous construction as of this writing.
 * These are typed interface contracts ONLY. Every implementation returns
 * { status: 'not_implemented' } so the OS can register the capability slot
 * without ever fabricating a real-world action. When/if a real API ships,
 * swap the body — the OS spine already knows how to call it.
 */

export type PrimeStatus = 'not_implemented'

export interface PrimeResult {
  capability: string
  status: PrimeStatus
  note: string
}

function stub(capability: string): PrimeResult {
  return {
    capability,
    status: 'not_implemented',
    note: 'No real public API exists yet. Registered as a concept slot; performs no action.',
  }
}

/** Brain-Computer Interface intent stream (e.g. Neuralink-class). */
export interface BciAdapter {
  readIntent(): Promise<PrimeResult>
}
export const bci: BciAdapter = { async readIntent() { return stub('bci.readIntent') } }

/** Legged/arm robotics fleet (e.g. Boston Dynamics Spot/Atlas). */
export interface RoboticsAdapter {
  dispatchTask(task: string): Promise<PrimeResult>
}
export const robotics: RoboticsAdapter = { async dispatchTask() { return stub('robotics.dispatchTask') } }

/** Autonomous construction orchestration. */
export interface ConstructionAdapter {
  breakGround(plan: unknown): Promise<PrimeResult>
}
export const construction: ConstructionAdapter = { async breakGround() { return stub('construction.breakGround') } }

export const PRIME_CAPABILITIES = ['bci.readIntent', 'robotics.dispatchTask', 'construction.breakGround'] as const
