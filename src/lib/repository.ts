import { supabaseAdmin } from './supabase';

// OMNIS repository — the single typed gateway between the OS spine and Postgres.
// One function per pillar table. All writes go through here so the honesty
// contract (no faked on-chain / concept results) is enforced in one place.

export interface CommandRow {
  id?: string;
  intent: string;
  status?: string;
  created_at?: string;
}

export async function createCommand(intent: string): Promise<CommandRow> {
  const { data, error } = await supabaseAdmin
    .from('commands')
    .insert({ intent, status: 'received' })
    .select()
    .single();
  if (error) throw new Error(`[OMNIS] createCommand failed: ${error.message}`);
  return data as CommandRow;
}

export async function saveForgePlan(commandId: string, plan: unknown) {
  const { error } = await supabaseAdmin
    .from('forge_plans')
    .insert({ command_id: commandId, plan });
  if (error) throw new Error(`[OMNIS] saveForgePlan failed: ${error.message}`);
}

export async function saveSimulation(commandId: string, result: unknown) {
  const { error } = await supabaseAdmin
    .from('simulations')
    .insert({ command_id: commandId, result });
  if (error) throw new Error(`[OMNIS] saveSimulation failed: ${error.message}`);
}

export async function saveOracleInsight(commandId: string, insight: unknown) {
  const { error } = await supabaseAdmin
    .from('oracle_insights')
    .insert({ command_id: commandId, insight });
  if (error) throw new Error(`[OMNIS] saveOracleInsight failed: ${error.message}`);
}

export async function recordExecution(commandId: string, adapter: string, status: string, detail: unknown) {
  const { error } = await supabaseAdmin
    .from('executions')
    .insert({ command_id: commandId, adapter, status, detail });
  if (error) throw new Error(`[OMNIS] recordExecution failed: ${error.message}`);
}

export async function updateCommandStatus(id: string, status: string) {
  const { error } = await supabaseAdmin.from('commands').update({ status }).eq('id', id);
  if (error) throw new Error(`[OMNIS] updateCommandStatus failed: ${error.message}`);
}
