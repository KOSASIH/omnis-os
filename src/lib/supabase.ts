import { createClient } from '@supabase/supabase-js';

// OMNIS live data layer — connects the OS spine to the 7-table Postgres backend.
// Env vars are provisioned by the Naive `apps` primitive (Supabase project).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (!url || !anonKey) {
  // Fail loud, never silently fake a connection.
  // eslint-disable-next-line no-console
  console.warn('[OMNIS] Supabase env not set — data layer is offline.');
}

// Browser / RLS-scoped client.
export const supabase = createClient(url, anonKey);

// Server-side privileged client (edge functions, orchestrator writes).
export const supabaseAdmin = serviceKey
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : supabase;

export const isLive = Boolean(url && anonKey);
