/**
 * OMNIS core tests. Framework-agnostic (vitest/jest compatible).
 * These guard the HONESTY CONTRACT: concept modules must never report success.
 */

import { describe, it, expect } from 'vitest'
import { PILLARS } from '../src/omnis'
import { bci, robotics, construction, PRIME_CAPABILITIES } from '../src/pillars/omnis-prime/interfaces'

describe('OMNIS boot spine', () => {
  it('registers exactly 5 pillars', () => {
    expect(PILLARS).toHaveLength(5)
    expect(PILLARS).toContain('reality-forge')
    expect(PILLARS).toContain('aether-vault')
  })
})

describe('OMNIS Prime honesty contract', () => {
  it('BCI never fakes a real action', async () => {
    const r = await bci.readIntent()
    expect(r.status).toBe('not_implemented')
  })

  it('robotics never fakes a dispatch', async () => {
    const r = await robotics.dispatchTask('walk forward')
    expect(r.status).toBe('not_implemented')
  })

  it('construction never fakes breaking ground', async () => {
    const r = await construction.breakGround({})
    expect(r.status).toBe('not_implemented')
  })

  it('exposes all three prime capability slots', () => {
    expect(PRIME_CAPABILITIES).toHaveLength(3)
  })
})
