/**
 * OMNIS — Pillar 5: Aether Vault UI
 * Wallet connect + $OMNIS tokenomics + DAO governance panel.
 *
 * HONESTY FLAG: Renders a clear "CONCEPT — not live on-chain" banner. Wallet
 * adapter is scaffolded (@solana/wallet-adapter) but no mint exists yet.
 */
'use client';

import { OMNIS_TOKEN } from '../pillars/aether-vault/omnis-token';

export function VaultPanel() {
  const t = OMNIS_TOKEN;
  return (
    <section className="vault-panel">
      <div className="concept-banner" role="status">
        ⚠ CONCEPT — $OMNIS is not deployed on-chain. Figures are illustrative.
      </div>
      <h2>Aether Vault · ${t.symbol}</h2>
      <dl className="token-stats">
        <div><dt>Supply</dt><dd>{t.totalSupply.toLocaleString()} (deflationary)</dd></div>
        <div><dt>Standard</dt><dd>{t.standard} on {t.chain}</dd></div>
        <div><dt>Buyback + Burn</dt><dd>{t.buybackBurnFeeBps / 100}% of platform fees</dd></div>
        <div><dt>Status</dt><dd>{t.IS_LIVE ? 'LIVE' : 'concept / not deployed'}</dd></div>
      </dl>
      <button disabled title="Enabled once a live mint + RPC are configured">
        Connect Wallet (disabled — no live mint)
      </button>
    </section>
  );
}
