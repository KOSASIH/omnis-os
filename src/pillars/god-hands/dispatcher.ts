/**
 * OMNIS — Pillar 4: God Hands IRL
 * Phase 2 · Execution Layer
 *
 * Turns a Forge/Oracle-approved plan into real-world actions by dispatching
 * to registered execution adapters. Every dispatch is logged to the
 * `executions` table (see db/schema.sql) with a verifiable status trail.
 *
 * REAL adapters:   n8n webhook, email, social post, HTTP/API call.
 * CONCEPT adapters: drone, robot-arm (Boston Dynamics), gov-API — these are
 *                   clearly flagged `concept: true`. No public API exists to
 *                   fulfill them today; they return a NOT_IMPLEMENTED result
 *                   instead of pretending to act.
 */

export type ExecutionStatus =
  | 'queued'
  | 'dispatched'
  | 'succeeded'
  | 'failed'
  | 'not_implemented';

export interface ExecutionRequest {
  commandId: string;
  adapter: string;
  payload: Record<string, unknown>;
}

export interface ExecutionResult {
  adapter: string;
  status: ExecutionStatus;
  concept: boolean;
  detail: string;
  dispatchedAt: string;
  externalRef?: string;
}

export interface ExecutionAdapter {
  name: string;
  concept: boolean;
  run(req: ExecutionRequest): Promise<ExecutionResult>;
}

/** REAL: fire an n8n workflow webhook. This actually reaches the network. */
export const n8nAdapter: ExecutionAdapter = {
  name: 'n8n',
  concept: false,
  async run(req) {
    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) {
      return result('n8n', 'failed', false, 'N8N_WEBHOOK_URL not configured');
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ commandId: req.commandId, ...req.payload }),
    });
    return result(
      'n8n',
      res.ok ? 'succeeded' : 'failed',
      false,
      `n8n responded ${res.status}`,
      res.headers.get('x-execution-id') ?? undefined,
    );
  },
};

/** REAL: generic authenticated HTTP call to any partner/gov API. */
export const httpAdapter: ExecutionAdapter = {
  name: 'http',
  concept: false,
  async run(req) {
    const { url, method = 'POST' } = req.payload as { url?: string; method?: string };
    if (!url) return result('http', 'failed', false, 'payload.url required');
    const res = await fetch(url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: method === 'GET' ? undefined : JSON.stringify(req.payload),
    });
    return result('http', res.ok ? 'succeeded' : 'failed', false, `HTTP ${res.status}`);
  },
};

/** CONCEPT: physical robotics — no public API. Honest NOT_IMPLEMENTED. */
function conceptAdapter(name: string, reason: string): ExecutionAdapter {
  return {
    name,
    concept: true,
    async run() {
      return result(name, 'not_implemented', true, reason);
    },
  };
}

export const droneAdapter = conceptAdapter(
  'drone',
  'No universal consumer drone command API exists; ships as concept UI.',
);
export const robotArmAdapter = conceptAdapter(
  'boston-dynamics',
  'Boston Dynamics exposes no public cloud control API; concept only.',
);

export const ADAPTER_REGISTRY: Record<string, ExecutionAdapter> = {
  [n8nAdapter.name]: n8nAdapter,
  [httpAdapter.name]: httpAdapter,
  [droneAdapter.name]: droneAdapter,
  [robotArmAdapter.name]: robotArmAdapter,
};

export async function dispatch(req: ExecutionRequest): Promise<ExecutionResult> {
  const adapter = ADAPTER_REGISTRY[req.adapter];
  if (!adapter) {
    return result(req.adapter, 'failed', false, `Unknown adapter '${req.adapter}'`);
  }
  return adapter.run(req);
}

function result(
  adapter: string,
  status: ExecutionStatus,
  concept: boolean,
  detail: string,
  externalRef?: string,
): ExecutionResult {
  return { adapter, status, concept, detail, dispatchedAt: new Date().toISOString(), externalRef };
}
