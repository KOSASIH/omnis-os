'use client'

/**
 * OMNIS landing surface — composes the command terminal and the vault panel
 * into the single-input experience described in the vision doc.
 */

import { OmnisTerminal } from './terminal'
import { VaultPanel } from './vault-panel'

export default function Landing() {
  return (
    <main className="min-h-screen bg-black text-cyan-100 font-mono">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
          OMNIS
        </h1>
        <p className="mt-2 text-lg text-cyan-300/80">The Autonomous World Operating System</p>
        <p className="mt-1 text-sm text-violet-300/70">Command Reality. AI Executes.</p>

        <div className="mt-10">
          <OmnisTerminal />
        </div>

        <div className="mt-12">
          <VaultPanel />
        </div>

        <footer className="mt-16 text-xs text-cyan-500/40">
          5 Pillars: Reality Forge · Quantum Earth · The Oracle · God Hands · Aether Vault.
          Concept-flagged modules are clearly labeled and never fabricate real-world actions.
        </footer>
      </section>
    </main>
  )
}
