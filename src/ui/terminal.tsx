'use client';

/**
 * OMNIS — Command Terminal (Phase 2 UI)
 * The single input surface for the whole OS. User types a command like:
 *   omnis launch "D2C Skincare Brand"
 * and OMNIS routes it through the pillar pipeline:
 *   Forge (plan) → Quantum Earth (simulate) → Oracle (intel) → God Hands (execute)
 *
 * This component is transport-agnostic: it POSTs the raw command to /api/command
 * and streams back status events. The AI-core wiring lands when credits unlock.
 */

import { useCallback, useRef, useState } from 'react';

type Line = { kind: 'in' | 'out' | 'sys' | 'err'; text: string };

const BANNER = [
  '  ██████  ███████ ██   ██ ███████ ',
  ' ██    ██ ████    ███ ██ ██      ',
  ' ██    ██ ████    ██ ██ ███████ ',
  ' ██    ██ ██      ██  ██      ██ ',
  '  ██████  ███████ ██   ██ ███████ ',
  '  Command Reality. AI Executes.',
];

export function OmnisTerminal() {
  const [lines, setLines] = useState<Line[]>(BANNER.map((t) => ({ kind: 'sys', text: t })));
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const push = useCallback((line: Line) => {
    setLines((prev) => [...prev, line]);
    queueMicrotask(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }));
  }, []);

  const submit = useCallback(async () => {
    const cmd = value.trim();
    if (!cmd || busy) return;
    push({ kind: 'in', text: `> ${cmd}` });
    setValue('');
    setBusy(true);
    try {
      const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      if (!res.ok) throw new Error(`server ${res.status}`);
      const data = (await res.json()) as { events?: string[] };
      (data.events ?? ['(no output — AI core awaiting credits)']).forEach((e) =>
        push({ kind: 'out', text: e }),
      );
    } catch (err) {
      push({ kind: 'err', text: `error: ${(err as Error).message}` });
    } finally {
      setBusy(false);
    }
  }, [value, busy, push]);

  return (
    <div className="font-mono text-sm bg-black text-cyan-300 rounded-xl p-4 h-[480px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {lines.map((l, i) => (
          <pre key={i} className={colorFor(l.kind)}>{l.text}</pre>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-cyan-900">
        <span className="text-gold-400">omnis</span>
        <input
          className="flex-1 bg-transparent outline-none text-cyan-100"
          placeholder={busy ? 'executing…' : 'launch "D2C Skincare Brand"'}
          value={value}
          disabled={busy}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
      </div>
    </div>
  );
}

function colorFor(kind: Line['kind']): string {
  switch (kind) {
    case 'in': return 'text-white';
    case 'err': return 'text-red-400';
    case 'sys': return 'text-cyan-500';
    default: return 'text-cyan-300';
  }
}
