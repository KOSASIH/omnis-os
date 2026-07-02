/**
 * OMNIS — Live command endpoint (Next.js App Router).
 *
 * Binds the typed Supabase repository to the pillar orchestrator so a POST to
 * /api/command persists the command, runs the pipeline, and records the
 * execution — all against live Postgres. No fabricated results: AI-core stages
 * surface as `pending_ai` until credits unlock.
 */
import { NextResponse } from 'next/server';
import { handleCommand, type Db } from '../../../api/command';
import {
  createCommand,
  recordExecution,
  updateCommandStatus,
} from '../../../lib/repository';
import { supabase } from '../../../lib/supabase';

export const runtime = 'nodejs';

/** Adapter: the orchestrator's minimal Db contract, backed by the real repository. */
const db: Db = {
  async insertCommand(raw, verb, target) {
    const row = await createCommand({ raw, verb, target, status: 'running' });
    return row.id;
  },
  async recordExecution(commandId, r) {
    await recordExecution({
      command_id: commandId,
      adapter: r.adapter,
      status: r.status,
      detail: r.detail,
    });
    await updateCommandStatus(commandId, r.status === 'dispatched' ? 'executing' : 'done');
  },
};

export async function POST(req: Request) {
  if (!supabase.isLive) {
    return NextResponse.json(
      { error: 'db_offline', hint: 'Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to persist commands.' },
      { status: 503 },
    );
  }

  let body: { command?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const command = (body.command ?? '').trim();
  if (!command) {
    return NextResponse.json({ error: 'empty_command', hint: 'try: omnis launch "D2C Skincare Brand"' }, { status: 400 });
  }

  try {
    const result = await handleCommand({ command }, db);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    return NextResponse.json({ error: 'pipeline_failed', message }, { status: 500 });
  }
}

/** Health probe — confirms the endpoint + DB wiring without mutating state. */
export async function GET() {
  return NextResponse.json({
    endpoint: 'omnis/command',
    db: supabase.isLive ? 'live' : 'offline',
    accepts: 'POST { command: string }',
  });
}
